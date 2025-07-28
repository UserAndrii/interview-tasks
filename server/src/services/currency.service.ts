import axios from "axios";

import cache from "../utils/cache";
import { CurrencyRate } from "../types/currency.types";

const NBU_API_URL =
  "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json";

export const fetchRate = async (from: string, to: string): Promise<number> => {
  const cacheKey = "exchangeRates";
  let rates: CurrencyRate[];

  if (cache.has(cacheKey)) {
    rates = cache.get(cacheKey) as CurrencyRate[];
  } else {
    const { data } = await axios.get(NBU_API_URL);
    rates = data;
    cache.set(cacheKey, rates);
  }

  if (from === "UAH") {
    const toRate = rates.find((r) => r.cc === to);
    if (!toRate) throw new Error("Invalid target currency");
    return 1 / toRate.rate;
  }

  if (to === "UAH") {
    const fromRate = rates.find((r) => r.cc === from);
    if (!fromRate) throw new Error("Invalid source currency");
    return fromRate.rate;
  }

  const fromRate = rates.find((r) => r.cc === from);
  const toRate = rates.find((r) => r.cc === to);

  if (!fromRate || !toRate) throw new Error("Invalid currency pair");

  return fromRate.rate / toRate.rate;
};

export const convertAmount = async (
  from: string,
  to: string,
  amount: number
): Promise<number> => {
  const rate = await fetchRate(from, to);
  return +(amount * rate).toFixed(2);
};
