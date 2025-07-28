import { Router } from "express";
import {
  convertCurrency,
  getExchangeRate,
} from "../controllers/currency.controller";

const router = Router();

router.get("/rate", getExchangeRate);
router.get("/convert", convertCurrency);

export default router;
