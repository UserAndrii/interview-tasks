import { fetchRate, convertAmount } from "../services/currency.service";

export const getExchangeRate = async (req: any, res: any) => {
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ error: "Missing currency parameters" });
  }

  try {
    const rate = await fetchRate(from.toString(), to.toString());
    res.json({ rate });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exchange rate" });
  }
};

export const convertCurrency = async (req: any, res: any) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const result = await convertAmount(
      from.toString(),
      to.toString(),
      parseFloat(amount as string)
    );
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Conversion failed" });
  }
};
