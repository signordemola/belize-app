import React from "react";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { getCachedCryptoData } from "@/lib/crypto-actions";
import Image from "next/image";

const formatNumber = (num: number): string => {
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return `$${num.toFixed(2)}`;
};

const formatPrice = (price: number): string => {
  if (price < 1) return `$${price.toFixed(4)}`;
  return `$${price.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
};

export async function CryptoTracker() {
  try {
    const { global, markets } = await getCachedCryptoData();

    return (
      <div className="bg-gray-900 border-b border-gray-800 py-0.5 px-4 shadow-lg">
        <div className="flex items-center">
          {/* Brand/Title */}
          <div className="flex items-center space-x-2 mr-6 flex-shrink-0">
            <Activity className="h-5 w-5 text-blue-400" />
            <span className="text-white font-semibold text-sm">
              Crypto Market
            </span>
          </div>

          {/* Global Stats - Hidden on mobile */}
          <div className="hidden lg:flex items-center space-x-6 mr-6 flex-shrink-0">
            <div className="text-xs">
              <span className="text-gray-400">Market Cap: </span>
              <span className="text-white font-medium">
                {formatNumber(global.total_market_cap.usd)}
              </span>
              <span
                className={`ml-1 ${
                  global.market_cap_change_percentage_24h_usd >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {global.market_cap_change_percentage_24h_usd >= 0 ? "+" : ""}
                {global.market_cap_change_percentage_24h_usd.toFixed(2)}%
              </span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">24h Vol: </span>
              <span className="text-white font-medium">
                {formatNumber(global.total_volume.usd)}
              </span>
            </div>
          </div>

          {/* Horizontal Scrolling Crypto List */}
          <div className="flex-1 overflow-hidden">
            <div className="flex space-x-4 overflow-x-auto py-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {markets.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg px-3 py-2 min-w-max cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
                >
                  <Image
                    src={coin.image || "/images/placeholder.svg"}
                    alt={coin.name}
                    height={16}
                    width={16}
                    className="w-5 h-5 rounded-full"
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-xs">
                      {coin.symbol.toUpperCase()}
                    </span>
                    <span className="text-gray-300 text-xs font-semibold">
                      {formatPrice(coin.current_price)}
                    </span>
                    <div
                      className={`flex items-center space-x-1 text-xs ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span className="font-medium">
                        {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading crypto data:", error);
    return (
      <div className="bg-gray-900 border-b border-gray-800 py-0.5 px-4">
        <div className="flex items-center space-x-3">
          <Activity className="h-5 w-5 text-red-400" />
          <span className="text-gray-400 text-sm">
            Crypto data unavailable, Please try again later!
          </span>
        </div>
      </div>
    );
  }
}
