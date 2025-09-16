"use server";

import { unstable_cache } from "next/cache";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

interface GlobalData {
  active_cryptocurrencies: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_change_percentage_24h_usd: number;
}

interface CombinedCryptoData {
  global: GlobalData;
  markets: CryptoData[];
}

const fetchCryptoData = async (): Promise<CombinedCryptoData> => {
  try {
    const [globalResponse, marketsResponse] = await Promise.all([
      fetch("https://api.coingecko.com/api/v3/global", {
        headers: {
          Accept: "application/json",
        },
      }),
      fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&sparkline=false&price_change_percentage=24h",
        {
          headers: {
            Accept: "application/json",
          },
        }
      ),
    ]);

    if (!globalResponse.ok || !marketsResponse.ok) {
      throw new Error("Failed to fetch crypto data");
    }

    const [globalData, marketsData] = await Promise.all([
      globalResponse.json(),
      marketsResponse.json(),
    ]);

    return {
      global: globalData.data,
      markets: marketsData,
    };
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    throw error;
  }
};

export const getCachedCryptoData = unstable_cache(
  fetchCryptoData,
  ["crypto-data"],
  {
    revalidate: 150,
    tags: ["crypto"],
  }
);
