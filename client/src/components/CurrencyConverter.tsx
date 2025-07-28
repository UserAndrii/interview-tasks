import React, { useState } from "react";

type CurrencyCode = "USD" | "EUR" | "UAH";

interface Currency {
  code: CurrencyCode;
  name: string;
}

export const API_BASE_URL = "http://localhost:8000";

const defaultCurrencies: Currency[] = [
  { code: "USD", name: "Долар США" },
  { code: "EUR", name: "Євро" },
  { code: "UAH", name: "Гривня" },
];

const CurrencyConverter: React.FC = () => {
  const [from, setFrom] = useState<CurrencyCode>("USD");
  const [to, setTo] = useState<CurrencyCode>("UAH");
  const [amount, setAmount] = useState<number>(1);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleConvert = async () => {
    setError(null);
    setResult(null);

    if (!amount || amount <= 0) {
      setError("Сума повинна бути більшою за 0");
      return;
    }

    if (from === to) {
      setResult(`${amount} ${from} = ${amount} ${to}`);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/currency/convert?from=${from}&to=${to}&amount=${amount}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Сталася неочікувана помилка. Спробуйте знову"
        );
      }

      setResult(`${amount} ${from} = ${data.result} ${to}`);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Невідома помилка");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 2px 8px #ddd",
      }}
    >
      <h2>Конвертер валют (НБУ)</h2>
      <div>
        <input
          type="number"
          value={amount}
          min={0}
          step="any"
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{
            width: "100%",
            marginBottom: 12,
            fontSize: 18,
            padding: 8,
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as CurrencyCode)}
          style={{ flex: 1 }}
        >
          {defaultCurrencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        <span style={{ alignSelf: "center" }}>→</span>
        <select
          value={to}
          onChange={(e) => setTo(e.target.value as CurrencyCode)}
          style={{ flex: 1 }}
        >
          {defaultCurrencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <button
        onClick={handleConvert}
        disabled={loading}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: 16,
          backgroundColor: "#4CAF50",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        {loading ? "Конвертується..." : "Конвертувати"}
      </button>
      {result && (
        <p
          style={{
            marginTop: 16,
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          {result}
        </p>
      )}
      {error && (
        <p style={{ color: "red", marginTop: 12, textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default CurrencyConverter;
