import React from 'react';

interface DialogProps {
  id: string; 
  children?: React.ReactNode; 
  className?: string;
  size?: string;
  title?: string; 
  closeText?: string; 
  acceptText?: string; 
  onAccept?: ()=> void;
}

const Dialog: React.FC<DialogProps> = ({
  id,
  children,
  className = '',
  size = 'max-w-5xl',
  title = 'Dialog',
  closeText = 'Close',
  acceptText,
  onAccept
}) => {
  return (
    <dialog id={id} className={`modal ${className}`}>
      <div className={`modal-box w-11/12 ${size}`}>
        {title && <h3 className="font-bold text-lg">{title}</h3>}
        
        <form className="modal-action flex-col" method="dialog">
          <div className="py-4">{children}</div>
          <div className='flex flex-row gap-4 justify-end'>
            <button className="btn btn-error">{closeText}</button>
            {acceptText && <button className="btn btn-success" onClick={onAccept}>{acceptText}</button>}
          </div>
        </form>
      </div>
    </dialog>
  );
};

export default Dialog;
