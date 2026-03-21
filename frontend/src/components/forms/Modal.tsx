import { useEffect, type PropsWithChildren } from 'react'
import { useI18n } from '../../i18n'

interface ModalProps extends PropsWithChildren {
  isOpen: boolean
  title: string
  onClose: () => void
}

export function Modal({ isOpen, title, onClose, children }: ModalProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className="modal-head">
          <h3 className="modal-title">{title}</h3>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label={t('common.closeDialog')}
          >
            x
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </section>
    </div>
  )
}
