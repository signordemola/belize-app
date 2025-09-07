"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface MobileDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileDepositModal = ({ isOpen, onClose }: MobileDepositModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-5xl overflow-y-auto max-h-[80vh]">
        <div className="bg-gray-50/50 rounded-xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 mb-4">
              Mobile Deposit
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deposit To
              </label>
              <select
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 hover:bg-white transition-colors duration-200"
                required
              >
                <option value="">Select account</option>
                <option value="Checking">Checking (*4544) - $719,725</option>
                <option value="Savings">Savings (*4490) - $5,704,583</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  className="w-full p-3 pl-8 border border-gray-200 rounded-xl focus:ring-primary-500 focus:border-primary-500 bg-gray-50 hover:bg-white transition-colors duration-200"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="file"
                  id="front-image"
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="front-image"
                  className="block w-full aspect-video border-2 border-dashed rounded-xl border-gray-300 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <span className="text-3xl mb-2">📸</span>
                    <span className="text-sm font-medium text-gray-700">
                      Upload Check Front
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Click to upload
                    </span>
                  </div>
                </label>
              </div>
              <div className="relative">
                <input
                  type="file"
                  id="back-image"
                  className="hidden"
                  accept="image/*"
                />
                <label
                  htmlFor="back-image"
                  className="block w-full aspect-video border-2 border-dashed rounded-xl border-gray-300 bg-gray-50 hover:border-emerald-500 hover:bg-emerald-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <span className="text-3xl mb-2">📸</span>
                    <span className="text-sm font-medium text-gray-700">
                      Upload Check Back
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      Click to upload
                    </span>
                  </div>
                </label>
              </div>
            </div>
            <button
              type="submit"
              disabled
              className="w-full py-3 px-4 rounded-xl text-white font-medium bg-gray-300 cursor-not-allowed transition-colors duration-200"
            >
              Deposit Check
            </button>
            <div className="mt-6 bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Important Notes:
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-center">
                  <span className="text-emerald-500 mr-2">•</span>
                  Ensure check is signed and endorsed
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-500 mr-2">•</span>
                  {"Write 'For Mobile Deposit Only' below signature"}
                </li>
                <li className="flex items-center">
                  <span className="text-emerald-500 mr-2">•</span>
                  Images must be clear and well-lit
                </li>
              </ul>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileDepositModal;
