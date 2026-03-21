interface SubmitBarProps {
  isSubmitting?: boolean
  submitLabel?: string
  submittingLabel?: string
  cancelLabel?: string
  onCancel?: () => void
}

export function SubmitBar({
  isSubmitting,
  submitLabel = 'Save',
  submittingLabel = 'Saving...',
  cancelLabel = 'Cancel',
  onCancel,
}: SubmitBarProps) {
  return (
    <div className="submit-bar">
      {onCancel ? (
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={isSubmitting}>
          {cancelLabel}
        </button>
      ) : null}
      <button type="submit" className="btn" disabled={isSubmitting}>
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </div>
  )
}
