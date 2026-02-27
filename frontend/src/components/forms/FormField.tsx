import type { PropsWithChildren } from 'react'

interface FormFieldProps extends PropsWithChildren {
  htmlFor: string
  label: string
  error?: string
  hint?: string
  required?: boolean
}

export function FormField({ htmlFor, label, error, hint, required, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="field-hint">{hint}</p> : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  )
}
