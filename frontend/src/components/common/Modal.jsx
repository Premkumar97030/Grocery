import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto perspective-1000">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop with 3D depth blur */}
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* 3D Elevated Modal Window */}
        <div
          className={`w-full ${maxWidth} transform overflow-hidden rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 text-left align-middle shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.9)_inset] transition-all relative z-10 border border-slate-200/80 animate-in zoom-in-95 duration-200 preserve-3d`}
          style={{ transform: 'translateZ(30px)' }}
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-xl font-black text-slate-900 leading-6 tracking-tight">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer active:scale-95"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
