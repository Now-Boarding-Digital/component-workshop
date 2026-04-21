import React from 'react'

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  icon?: React.ReactNode
}

export default function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        bg-ui-action border border-ui-action
        text-neutral-white font-body font-bold text-base leading-6
        rounded-control-lg
        ${icon ? 'pl-6 pr-8' : 'px-8'} py-4
        transition-colors
        hover:opacity-90
        focus:outline-none focus:ring-2 focus:ring-ui-action focus:ring-offset-2
        disabled:opacity-[var(--opacity-disabled)] disabled:pointer-events-none
      `.trim().replace(/\s+/g, ' ')}
      aria-disabled={disabled}
    >
      {icon && (
        <span className="size-6 flex items-center justify-center shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  )
}
