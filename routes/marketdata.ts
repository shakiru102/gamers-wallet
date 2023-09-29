import { Router } from "express";
import { getCoinDetails, getPrice, getTokenList } from "../controllers/marketdata";

const route = Router()

route.get('/coin-details', getCoinDetails)
route.get('/coin-price', getPrice)
route.get('/coin-list', getTokenList)

export default route