import { forwardRef } from 'react'
import clsx from 'clsx'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  placeholder?: string
  options: SelectOption[]
  error?: string
  helperText?: string
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    placeholder, 
    options, 
    error, 
    helperText, 
    fullWidth = true,
    className,
    ...props 
  }, ref) => {
    return (
      <div className="form-control">
        {label && (
          <label className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        
        <select
          ref={ref}
          className={clsx(
            'select select-bordered bg-transparent',
            {
              'w-full': fullWidth,
              'select-error': error,
            },
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {(error || helperText) && (
          <label className="label">
            <span className={clsx('label-text-alt', {
              'text-error': error,
              'text-base-content/60': !error && helperText
            })}>
              {error || helperText}
            </span>
          </label>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
