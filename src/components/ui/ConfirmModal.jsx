import Button from './Button'
import Modal from './Modal'

export default function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'primary',
  onConfirm,
  onCancel,
}) {
  const handleCancel = () => {
    if (onCancel) onCancel()
  }

  const handleConfirm = () => {
    if (onConfirm) onConfirm()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title={title}>
      <div className="space-y-4">
        {description && (
          <p className="text-sm text-slate-700">
            {description}
          </p>
        )}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}


