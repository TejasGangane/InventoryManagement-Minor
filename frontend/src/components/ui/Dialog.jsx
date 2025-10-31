import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 bg-background rounded-lg shadow-lg max-w-lg w-full mx-4">
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogContent = ({ className, children, onClose }) => {
  return (
    <div className={cn('p-6', className)}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
      {children}
    </div>
  );
};

export const DialogHeader = ({ className, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left mb-4', className)} {...props} />
  );
};

export const DialogTitle = ({ className, ...props }) => {
  return (
    <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props} />
  );
};

export const DialogDescription = ({ className, ...props }) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)} {...props} />
  );
};

export const DialogFooter = ({ className, ...props }) => {
  return (
    <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props} />
  );
};

