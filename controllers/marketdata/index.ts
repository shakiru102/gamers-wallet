import axios from "axios";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";

export const getCoinDetails = async (req: Request, res: Response) => {
    try {
        const symbol: string = req.query.symbol as string
        if(!symbol) return res.status(422).json(responseHandler(null, null, Error('symbol not found')))
        const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
         res.status(200).json(responseHandler('Coin details fetched successfully', coinData.data.data))
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const getPrice = async (req: Request, res: Response) => {
    try {
        const symbol: string = req.query.symbol as string
        if(!symbol) return res.status(422).json(responseHandler(null, null, Error('symbol not found')))
        const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
         res.status(200).json(responseHandler('Coin price fetched successfully', coinData.data.data))
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const getTokenList = async (req: Request, res: Response) => {
    try {
        const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
         res.status(200).json(responseHandler('Coin details fetched successfully', coinData.data.data))
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}