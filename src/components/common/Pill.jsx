import { Link } from 'react-router-dom'

/* The one pill primitive. Everything on this page is a pill: the nav, the CTAs,
   the tags, the channel chips.

   variant: white | ink | outline | ghost | wash-outline
   as:      auto — <Link> for an internal `to`, <a> for `href`, else <button>

   HOUSE RULE, enforced here: a control that cannot be used is DISABLED WITH ITS
   REASON VISIBLE, never hidden. Pass `disabledReason` and the pill renders inert
   with the reason beside it, so nobody hunts for a button that silently vanished. */
export default function Pill({
  children,
  variant = 'white',
  size = 'md',
  to,
  href,
  onClick,
  disabled = false,
  disabledReason = null,
  className = '',
  ...rest
}) {
  const classes = [
    'pill',
    `pill--${variant}`,
    size !== 'md' ? `pill--${size}` : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const inner = <span className="pill__label">{children}</span>

  let control
  if (disabled) {
    control = (
      <span className={classes} aria-disabled="true" {...rest}>
        {inner}
      </span>
    )
  } else if (to) {
    control = (
      <Link className={classes} to={to} {...rest}>
        {inner}
      </Link>
    )
  } else if (href) {
    const external = /^https?:/i.test(href)
    control = (
      <a
        className={classes}
        href={href}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...rest}
      >
        {inner}
      </a>
    )
  } else {
    control = (
      <button className={classes} type="button" onClick={onClick} {...rest}>
        {inner}
      </button>
    )
  }

  if (disabled && disabledReason) {
    return (
      <span className="pill-with-reason">
        {control}
        <span className="pill-reason label">{disabledReason}</span>
      </span>
    )
  }

  return control
}
