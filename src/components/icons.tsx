import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function WhatsAppIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...rest}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.28-.47-2.44-1.5-.9-.8-1.5-1.8-1.68-2.1-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.65-1.6-.9-2.18-.23-.57-.47-.5-.65-.5h-.55c-.2 0-.5.07-.75.37-.27.3-1.02 1-1.02 2.43 0 1.43 1.05 2.82 1.2 3.01.15.2 2.06 3.28 5.06 4.47 2.5.98 3 .8 3.55.75.54-.05 1.75-.72 2-1.4.25-.7.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35Z" />
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.45 3.37 1.25 4.8L2 22l5.5-1.42a9.8 9.8 0 0 0 4.54 1.11c5.43 0 9.84-4.4 9.84-9.85C21.88 6.4 17.47 2 12.04 2Zm0 17.94c-1.5 0-2.9-.4-4.1-1.1l-.3-.18-3.05.79.8-2.96-.2-.32a8.1 8.1 0 0 1-1.24-4.33c0-4.47 3.63-8.1 8.1-8.1 4.46 0 8.09 3.63 8.09 8.1 0 4.47-3.63 8.1-8.1 8.1Z" />
    </svg>
  )
}

export function InstagramIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <rect x="3" y="3" width="18" height="18" rx="5.4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function PinIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10.4" r="2.6" />
    </svg>
  )
}

export function ClockIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.4V12l3.2 2" />
    </svg>
  )
}

export function ArrowIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M5 12h13M12.5 5.5 19 12l-6.5 6.5" />
    </svg>
  )
}

export function SparkIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...rest}>
      <path d="M12 2.2c.4 3.9 1.6 6.2 3.6 7.1-2 .9-3.2 3.2-3.6 7.1-.4-3.9-1.6-6.2-3.6-7.1 2-.9 3.2-3.2 3.6-7.1Z" />
      <path d="M19.4 14.4c.24 2.1.94 3.35 2.1 3.85-1.16.5-1.86 1.75-2.1 3.85-.24-2.1-.94-3.35-2.1-3.85 1.16-.5 1.86-1.75 2.1-3.85Z" />
    </svg>
  )
}

/** Shopping bag — the "Order Online" affordance (replaces the old WhatsApp mark). */
export function OrderBagIcon({ className, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M5.5 8h13l-.9 11.1a1.6 1.6 0 0 1-1.6 1.4H8a1.6 1.6 0 0 1-1.6-1.4L5.5 8Z" />
      <path d="M8.6 8V6.6a3.4 3.4 0 0 1 6.8 0V8" />
    </svg>
  )
}

/** Four-square waffle mark — used in the wordmark and section dividers. */
export function WaffleMarkIcon({ className, ...rest }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className} {...rest}>
      <rect x="3" y="3" width="8" height="8" rx="2.4" />
      <rect x="13" y="3" width="8" height="8" rx="2.4" />
      <rect x="3" y="13" width="8" height="8" rx="2.4" />
      <rect x="13" y="13" width="8" height="8" rx="2.4" />
    </svg>
  )
}
