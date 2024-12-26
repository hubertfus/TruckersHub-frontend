import React, { useEffect, useRef, forwardRef } from 'react';

interface DialogProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  size?: string;
  title?: string;
  closeText?: string;
  acceptText?: string;
  isOpen?: boolean;
  onAccept?: () => void;
  onClose?: () => void;
}

const Dialog = forwardRef<HTMLDialogElement, DialogProps>(({
  id,
  children,
  className = '',
  size = 'max-w-5xl',
  title = 'Dialog',
  closeText = 'Close',
  acceptText,
  isOpen = false,
  onAccept,
  onClose
}, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleAccept = () => {
    if (onAccept) onAccept();
    dialogRef.current?.close();
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (ref && typeof ref !== 'function') {
      (ref as React.RefObject<HTMLDialogElement>).current?.close();
    } else {
      dialogRef.current?.close();
    }
  };

  return (
    <dialog id={id} ref={ref || dialogRef} className={`modal ${className}`}>
      <div className={`modal-box w-11/12 ${size} flex flex-col`}>
        {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
        <div className="flex-1 overflow-y-auto py-4">
          {children}
        </div>
        <div className="modal-action flex gap-4 justify-end">
          <button className="btn btn-error" onClick={handleClose}>{closeText}</button>
          {acceptText && <button className="btn btn-success" onClick={handleAccept}>{acceptText}</button>}
        </div>
      </div>
    </dialog>
  );
});

Dialog.displayName = 'Dialog';

export default Dialog;
