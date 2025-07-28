import express from "express";
import cors from "cors";

import currencyRoutes from "./routes/currency.routes";

const createHTTPServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors({ origin: true }));

  app.use("/api/currency", currencyRoutes);
  app.use("/ping", (req, res) => {
    res.send("Pong!");
  });

  return app;
};

export const app = createHTTPServer();
