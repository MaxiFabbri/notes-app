import { useEffect, useId, useRef } from 'react';
import './ConfirmDialog.css';

function ConfirmDialog({ title, message, pending, error, onConfirm, onCancel, confirmLabel = 'Delete note' }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function handleCancel(event) {
    event.preventDefault();
    if (!pending) onCancel();
  }

  return (
    <dialog ref={dialogRef} className="confirm-dialog" aria-labelledby={titleId} aria-describedby={messageId} onCancel={handleCancel}>
      <h2 id={titleId}>{title}</h2>
      <p id={messageId}>{message}</p>
      {error && <p className="confirm-error" role="alert">{error}</p>}
      <div className="confirm-actions" aria-busy={pending}>
        <button type="button" disabled={pending} onClick={onCancel} autoFocus>Cancel</button>
        <button type="button" className="confirm-delete" disabled={pending} onClick={onConfirm}>
          {pending ? 'Deleting...' : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}

export default ConfirmDialog;
