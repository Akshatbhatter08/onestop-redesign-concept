import { site } from '../config/site'
import { Reveal, Stagger, StaggerItem } from './Reveal'
import { SparkIcon } from './icons'

/**
 * The pricing hook, told as an argument rather than a feature grid: a claim on
 * the left, three pieces of evidence on the right.
 */
export function WhyUs() {
  return (
    <section id="why" className="relative isolate overflow-hidden py-20 md:py-28 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-24 h-[420px] w-[420px] rounded-full bg-honey-200/40 blur-[100px]"
      />

      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ---------- The claim ---------- */}
        <div className="lg:col-span-5">
          <Reveal x={-20} y={16}>
            <span className="eyebrow inline-flex items-center gap-2 text-honey-700">
              <SparkIcon className="h-3.5 w-3.5" />
              Why us
            </span>

            <h2 className="display mt-4 text-[clamp(2.125rem,8.6vw,2.75rem)] text-toast-800 md:text-[3.25rem] lg:text-[3.5rem]">
              A waffle should be more than{' '}
              <span className="display-accent text-berry-500">just dessert.</span>
            </h2>

            <p className="mt-5 max-w-[30rem] text-[1.0625rem] leading-[1.65] text-toast-500 md:text-[1.125rem]">
              Inspired by authentic Belgian waffles, we press every order fresh —
              traditional recipes met with creative toppings, premium chocolate,
              fresh fruit, and locally loved flavours. From a single after-dinner
              treat to catering a thousand waffle pops, every order matters to us.
            </p>
          </Reveal>
        </div>

        {/* ---------- The evidence ---------- */}
        <Stagger className="lg:col-span-7 lg:pt-3" stagger={0.11}>
          {site.proof.map((p, i) => (
            <StaggerItem key={p.kicker}>
              <div className="group flex gap-5 border-t border-toast-200/70 py-7 first:border-t-0 first:pt-0 md:gap-8 md:py-9">
                {/* Index */}
                <span className="price mt-0.5 shrink-0 text-[1.0625rem] text-honey-500 tabular-nums">
                  0{i + 1}
                </span>

                <div>
                  <span className="eyebrow text-toast-300">{p.kicker}</span>
                  <h3 className="display mt-2.5 text-[1.375rem] leading-[1.15] text-toast-800 md:text-[1.625rem]">
                    {p.title}
                  </h3>
                  <p className="mt-2.5 max-w-[34rem] text-[0.9375rem] leading-[1.7] text-toast-500 md:text-base">
                    {p.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
