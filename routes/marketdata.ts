import { Router } from "express";
import { dexExchangePrice, getCoinDetails, getPrice, getTokenList, networkTokens } from "../controllers/marketdata";

const route = Router()

route.get('/coin-details', getCoinDetails)
route.get('/coin-price', getPrice)
route.get('/coin-list', getTokenList)
route.get('/dex-swap-price', dexExchangePrice)
route.get('/network-tokens', networkTokens)

export default route