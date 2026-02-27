import { forwardRef, type InputHTMLAttributes } from 'react'

type NumberInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>((props, ref) => {
  return <input ref={ref} type="number" className="field-input" {...props} />
})

NumberInput.displayName = 'NumberInput'
