import { useState } from 'react'
import {
  menu,
  DEFAULT_MENU_CATEGORY,
  formatCad,
  type MenuCategory,
} from '../data/menu'
import { site } from '../config/site'
import { Reveal, Stagger, StaggerItem } from './Reveal'
import { MenuCard } from './MenuCard'
import { MagneticCta } from './MagneticCta'
import { OrderBagIcon } from './icons'
import { cx } from '../lib/cx'

/**
 * The menu.
 *
 * Category chips filter the Square catalogue. Cards below 768px still snap-
 * scroll; from 768px up they sit in a grid. Canned drinks use a compact list
 * so nine sodas don't inflate into waffle-glyph tiles.
 */
export function MenuGrid() {
  const [activeId, setActiveId] = useState(DEFAULT_MENU_CATEGORY)
  const category = menu.find((c) => c.id === activeId) ?? menu[0]

  return (
    <section
      id="menu"
      className="relative isolate overflow-hidden bg-cream-200/70 py-20 md:py-28 lg:py-32"
    >
      <div
        aria-hidden
        className="waffle-motif mask-fade-b pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="shell relative">
        <Reveal className="max-w-[40rem]" y={24}>
          <span className="eyebrow text-honey-700">The menu</span>
          <h2 className="display mt-4 text-[clamp(2.125rem,8.6vw,2.75rem)] text-toast-800 md:text-[3.25rem]">
            Belgian, Liège, and{' '}
            <span className="display-accent text-honey-600">a lot more.</span>
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-[1.65] text-toast-500 md:text-[1.125rem]">
            Pressed fresh when you order. Real items, real prices — tap anything
            to order on Square.
          </p>
        </Reveal>

        <div
          role="tablist"
          aria-label="Menu categories"
          className="no-scrollbar mt-8 -mx-5 flex snap-x gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
        >
          {menu.map((cat) => {
            const selected = cat.id === category.id
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="menu-panel"
                id={`menu-tab-${cat.id}`}
                onClick={() => setActiveId(cat.id)}
                className={cx(
                  'snap-start rounded-full px-4 text-[0.8125rem] font-semibold tracking-[-0.01em] whitespace-nowrap transition-colors duration-200',
                  'h-11 min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-toast-800',
                  selected
                    ? 'bg-toast-800 text-cream-50 shadow-soft'
                    : 'bg-cream-50 text-toast-600 ring-1 ring-toast-200/70 hover:bg-cream-100 hover:text-toast-800',
                )}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {category.blurb ? (
          <p className="mt-5 max-w-[36rem] text-[0.9375rem] leading-relaxed text-toast-500">
            {category.blurb}
          </p>
        ) : null}

        <div
          role="tabpanel"
          id="menu-panel"
          aria-labelledby={`menu-tab-${category.id}`}
        >
          {category.layout === 'list' ? (
            <DrinkList category={category} />
          ) : (
            <Stagger
              key={category.id}
              className="no-scrollbar mt-8 -mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-2 md:mx-0 md:mt-10 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3 xl:grid-cols-4"
              stagger={0.06}
            >
              {category.items.map((item, i) => (
                <StaggerItem
                  key={item.id}
                  className="w-[78vw] max-w-[310px] shrink-0 snap-start md:w-auto md:max-w-none"
                >
                  <MenuCard item={item} index={i} className="h-full" />
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>

        {category.layout !== 'list' && category.items.length > 2 ? (
          <p className="mt-4 text-center text-[0.75rem] font-medium tracking-[0.08em] text-toast-300 uppercase md:hidden">
            Swipe for more →
          </p>
        ) : null}

        <Reveal
          className="mt-12 flex flex-col items-center gap-5 text-center md:mt-16"
          y={20}
        >
          <MagneticCta
            href={site.links.order}
            variant="dark"
            icon={<OrderBagIcon className="h-[1.15rem] w-[1.15rem]" />}
            withArrow
          >
            Order online
          </MagneticCta>
        </Reveal>
      </div>
    </section>
  )
}

function DrinkList({ category }: { category: MenuCategory }) {
  return (
    <ul className="mt-8 divide-y divide-toast-200/70 overflow-hidden rounded-[var(--radius-card)] bg-cream-50 shadow-soft ring-1 ring-toast-200/60">
      {category.items.map((item) => (
        <li key={item.id}>
          <a
            href={site.links.order}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-14 items-center justify-between gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-honey-100/40"
          >
            <span className="text-[1rem] font-semibold text-toast-800">{item.name}</span>
            <span className="price shrink-0 text-[1rem] text-toast-800 tabular-nums">
              {formatCad(item.price, item.priceMax)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
