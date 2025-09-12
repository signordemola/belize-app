"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { getUserCards } from "@/lib/customer/dal";

interface Card {
  id: string;
  type: string;
  cardNumber: string;
  expiryDate: Date;
  status: string;
}

interface CardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CardsModal = ({ isOpen, onClose }: CardsModalProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCards = async () => {
    try {
      setIsLoading(true);
      const data = await getUserCards();
      setCards(data);
    } catch (err) {
      console.error("Failed to fetch user cards", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchCards();
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl py-12">
        <DialogHeader>
          <DialogTitle className="text-primary-600">
            {cards.length > 0 && cards.length === 1
              ? "Your Card"
              : "Your Cards"}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto space-y-6 my-10 flex items-center justify-center">
          {isLoading ? (
            <p className="text-gray-500 text-sm text-center">
              Loading your cards…
            </p>
          ) : cards.length > 0 ? (
            cards.map((card) => (
              <div
                key={card.id}
                className="flex flex-col md:flex-row gap-6 rounded-md bg-white"
              >
                {/* Card Visual - Redesigned to mimic a typical USA bank card */}
                <div className="w-full md:w-[300px] flex-shrink-0">
                  <div className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-2xl p-5 shadow-md overflow-hidden aspect-[1.586] text-white">
                    {/* Simulated chip */}
                    <div className="absolute top-6 left-4 w-10 h-7 bg-gradient-to-br from-yellow-500 to-yellow-700 rounded-md border border-yellow-800 shadow-inner" />

                    {/* Bank/Card type - top left */}
                    <div className="absolute top-4 left-16">
                      <h3 className="text-md font-semibold">{card.type}</h3>
                      <p className="text-xs opacity-80">{card.status}</p>
                    </div>

                    {/* Network placeholder (e.g., Visa) - top right */}
                    <div className="absolute top-4 right-4 w-12 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-md flex items-center justify-center text-xs font-bold">
                      VISA
                    </div>

                    {/* Card number - center, embossed look */}
                    <div className="absolute bottom-16 left-4 right-4">
                      <p className="text-lg font-mono tracking-widest text-shadow-md">
                        {card.cardNumber.replace(
                          /(\d{4})(\d{4})(\d{4})(\d{4})/,
                          "$1 $2 $3 $4"
                        )}
                      </p>
                    </div>

                    {/* Expiry - bottom right */}
                    <div className="absolute bottom-4 right-4 text-xs opacity-80">
                      <p>VALID THRU</p>
                      <p>
                        {new Date(card.expiryDate).toLocaleDateString("en-US", {
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </p>
                    </div>

                    {/* Status badge - bottom left */}
                    <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded-full text-xs backdrop-blur-sm bg-white/20">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm text-center">No cards found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CardsModal;
