import { forwardRef, type SelectHTMLAttributes } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[]
  placeholder?: string
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ options, placeholder, ...props }, ref) => {
    return (
      <select ref={ref} className="field-input" {...props}>
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  },
)

SelectField.displayName = 'SelectField'
