import { SmoothScroll } from './components/SmoothScroll'
import { Grain } from './components/Grain'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { WhyUs } from './components/WhyUs'
import { MenuGrid } from './components/MenuGrid'
import { Gallery } from './components/Gallery'
import { LocationMap } from './components/LocationMap'
import { StickyOrderBar } from './components/StickyOrderBar'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <SmoothScroll>
      <Grain />
      <Nav />

      <main>
        <Hero />
        <Marquee />
        <WhyUs />
        <MenuGrid />
        <Gallery />
        <LocationMap />
      </main>

      <Footer />
      <StickyOrderBar />
    </SmoothScroll>
  )
}
