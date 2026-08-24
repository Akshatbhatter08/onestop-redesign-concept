import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '..', 'tmp', 'breakpoints')
const URL = process.env.SHOT_URL ?? 'http://localhost:5173/'
const CHROME = process.env.CHROME ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

const WIDTHS = [
  { name: '390', width: 390, height: 844 },
  { name: '768', width: 768, height: 1024 },
  { name: '1023', width: 1023, height: 768 },
  { name: '1024', width: 1024, height: 768 },
  { name: '1025', width: 1025, height: 768 },
  { name: '1440', width: 1440, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
]

await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: [
    '--hide-scrollbars',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--enable-webgl',
    '--ignore-gpu-blocklist',
    '--enable-unsafe-swiftshader',
  ],
})

const report = []

try {
  for (const vp of WIDTHS) {
    const page = await browser.newPage()
    const errors = []
    page.on('pageerror', (err) => errors.push(String(err)))
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.waitForSelector('#home', { timeout: 15000 })
    try {
      await page.waitForSelector('#home canvas', { timeout: 8000 })
    } catch {
      /* 3D gated off — SVG fallback is the hero. */
    }
    await new Promise((r) => setTimeout(r, 900))

    const info = await page.evaluate(() => {
      const home = document.querySelector('#home')
      const canvas = home?.querySelector('canvas')
      const orderBtn = document.querySelector('[data-nav-order]')
      return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        layout: home?.getAttribute('data-hero-layout'),
        hasCanvas: Boolean(canvas),
        canvasSize: canvas ? { w: canvas.clientWidth, h: canvas.clientHeight } : null,
        navOrderOpacity: orderBtn ? getComputedStyle(orderBtn).opacity : null,
      }
    })

    const file = path.join(OUT, `${vp.name}-hero.png`)
    await page.screenshot({ path: file, type: 'png' })

    let scrolled = null
    if (vp.width <= 1023) {
      await page.evaluate(() => {
        const y = Math.round(window.innerHeight * 0.95)
        window.scrollTo(0, y)
        document.documentElement.scrollTop = y
        document.body.scrollTop = y
        window.dispatchEvent(new Event('scroll'))
      })
      await new Promise((r) => setTimeout(r, 900))
      const scrollInfo = await page.evaluate(() => {
        const orderBtn = document.querySelector('[data-nav-order]')
        const sticky = document.querySelector('[data-sticky-order]')
        return {
          scrollY: window.scrollY,
          navOrderOpacity: orderBtn ? getComputedStyle(orderBtn).opacity : null,
          stickyPresent: Boolean(sticky),
        }
      })
      const scrollFile = path.join(OUT, `${vp.name}-scrolled.png`)
      await page.screenshot({ path: scrollFile, type: 'png' })
      scrolled = { file: scrollFile, ...scrollInfo }
    }

    report.push({
      ...vp,
      file,
      errors,
      ...info,
      scrolled,
    })
    await page.close()
    console.log(
      `${vp.name}: layout=${info.layout} inner=${info.innerWidth} canvas=${info.hasCanvas} errors=${errors.length}`,
    )
  }
} finally {
  await browser.close()
}

await writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2))
console.log('wrote', path.join(OUT, 'report.json'))
