import { Link } from 'react-router-dom'

/* The button primitive, mapped onto the launchpad button system.

   variant: amber (money / primary) | gradient | ghost
   as:      auto — <Link> for an internal `to`, <a> for `href`, else <button>

   HOUSE RULE, enforced here: a control that cannot be used is DISABLED WITH ITS
   REASON VISIBLE, never hidden. Pass `disabledReason` and the button renders
   inert with the reason beneath, so nobody hunts for something that vanished. */
export default function Pill({
  children,
  variant = 'ghost',
  size = 'md',
  to,
  href,
  onClick,
  disabled = false,
  disabledReason = null,
  className = '',
  ...rest
}) {
  const classes = ['btn', `btn--${variant}`, size === 'sm' ? 'btn--sm' : '', className]
    .filter(Boolean)
    .join(' ')

  let control
  if (disabled) {
    control = (
      <span className={`${classes} is-disabled`} aria-disabled="true" {...rest}>
        {children}
      </span>
    )
  } else if (to) {
    control = (
      <Link className={classes} to={to} {...rest}>
        {children}
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
        {children}
      </a>
    )
  } else {
    control = (
      <button className={classes} type="button" onClick={onClick} {...rest}>
        {children}
      </button>
    )
  }

  if (disabled && disabledReason) {
    return (
      <span className="btn-with-reason">
        {control}
        <span className="btn-reason">{disabledReason}</span>
      </span>
    )
  }

  return control
}
