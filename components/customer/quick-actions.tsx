"use client";

import { useState } from "react";
import BillPayModal from ".././quick-actions-modal/bill-pay";
import MobileDepositModal from ".././quick-actions-modal/mobile-deposit";
import CardsModal from ".././quick-actions-modal/cards";
import StatementsModal from ".././quick-actions-modal/statements";
import ZelleModal from ".././quick-actions-modal/zelle";
import RewardsModal from ".././quick-actions-modal/rewards";

const QuickActions = () => {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  return (
    <div id="quick-actions" className="mb-8 scroll-smooth scroll-mt-30">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Quick Actions
      </h2>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-6">
            <button
              data-action-id="billpay"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg cursor-pointer"
              onClick={() => setOpenDialog("billpay")}
            >
              <div className="absolute inset-0 bg-rose-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl">💰</span>
                </div>
                <span className="text-sm font-medium text-white group-hover:scale-105 transition-transform duration-300">
                  Bill Pay
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
            <button
              data-action-id="deposit"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setOpenDialog("deposit")}
            >
              <div className="absolute inset-0 bg-gradient-card-secondary opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl">📱</span>
                </div>
                <span className="text-sm font-medium text-white group-hover:scale-105 transition-transform duration-300">
                  Mobile Deposit
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
            <button
              data-action-id="cards"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setOpenDialog("cards")}
            >
              <div className="absolute inset-0 bg-gradient-card-accent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl">💳</span>
                </div>
                <span className="text-sm font-medium text-white group-hover:scale-105 transition-transform duration-300">
                  Cards
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
            <button
              data-action-id="statements"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setOpenDialog("statements")}
            >
              <div className="absolute inset-0 bg-rose-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl">📄</span>
                </div>
                <span className="text-sm font-medium text-white group-hover:scale-105 transition-transform duration-300">
                  Statements
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
            <button
              data-action-id="zelle"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setOpenDialog("zelle")}
            >
              <div className="absolute inset-0 bg-gradient-card-secondary opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl">⚡</span>
                </div>
                <span className="text-sm font-medium text-white group-hover:scale-105 transition-transform duration-300">
                  Zelle
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
            <button
              data-action-id="rewards"
              className="group relative overflow-hidden rounded-md transition-all duration-300 hover:shadow-lg"
              onClick={() => setOpenDialog("rewards")}
            >
              <div className="absolute inset-0 bg-gradient-card-accent opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-4 flex flex-col items-center">
                <div className="w-12 h-12 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <span className="text-2xl">⭐</span>
                </div>
                <span className="text-sm font-medium text-white group-hover:scale-105 transition-transform duration-300">
                  Rewards
                </span>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full transform translate-x-8 -translate-y-8"></div>
            </button>
          </div>
        </div>
      </div>
      <BillPayModal
        isOpen={openDialog === "billpay"}
        onClose={() => setOpenDialog(null)}
      />
      <MobileDepositModal
        isOpen={openDialog === "deposit"}
        onClose={() => setOpenDialog(null)}
      />
      <CardsModal
        isOpen={openDialog === "cards"}
        onClose={() => setOpenDialog(null)}
      />
      <StatementsModal
        isOpen={openDialog === "statements"}
        onClose={() => setOpenDialog(null)}
      />
      <ZelleModal
        isOpen={openDialog === "zelle"}
        onClose={() => setOpenDialog(null)}
      />
      <RewardsModal
        isOpen={openDialog === "rewards"}
        onClose={() => setOpenDialog(null)}
      />
    </div>
  );
};

export default QuickActions;
