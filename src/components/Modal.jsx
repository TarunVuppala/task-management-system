"use client";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from "@/components/ui/dialog";

const Modal = ({ open, onClose, title, children, footer }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 bg-black/40" />
      <DialogContent className="fixed left-1/2 top-1/2 w-11/12 max-w-md transform -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">{children}</div>
        {footer && <div className="mt-4 flex justify-end gap-2">{footer}</div>}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
