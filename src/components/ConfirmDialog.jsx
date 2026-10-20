import Modal from './Modal';
import { Button } from './ui';

export default function ConfirmDialog({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      size="small"
      footer={
        <>
          <Button className="ml-auto" onClick={onCancel} data-autofocus>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-body">{message}</p>
    </Modal>
  );
}
