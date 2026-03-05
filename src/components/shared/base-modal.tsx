import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from './modal-provider';
import type { ReactNode } from 'react';

interface BaseModalProps {
  modalId: string;
  title: string;
  description?: string;
  children: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  showFooter?: boolean;
  maxHeight?: string;
}

export function BaseModal({
  modalId,
  title,
  description,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  confirmVariant = 'default',
  size = 'md',
  showFooter = true,
  maxHeight = 'max-h-[80vh]'
}: BaseModalProps) {
  const { isModalOpen, closeModal } = useModal();

  const isOpen = isModalOpen(modalId);

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    }
    closeModal(modalId);
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    closeModal(modalId);
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    '3xl': 'max-w-7xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className={`${sizeClasses[size]} ${maxHeight} overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        
        <div className="py-2">
          {children}
        </div>

        {showFooter && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose}>
              {cancelText}
            </Button>
            {onConfirm && (
              <Button variant={confirmVariant} onClick={handleConfirm}>
                {confirmText}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
