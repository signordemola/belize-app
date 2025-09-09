"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface ZelleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ZelleModal = ({ isOpen, onClose }: ZelleModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-lg overflow-y-auto max-h-[80vh]">
        <div className="bg-gray-50/50 rounded-md p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-gray-900 mb-4">
              Zelle
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-3xl">⚡</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Zelle Coming Soon
            </h3>
            <p className="text-gray-600">
              {
                "We're working on integrating Zelle for quick and easy transfers."
              }
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZelleModal;
