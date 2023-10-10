import axios from "axios";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";
import Moralis from 'moralis'
import { coinDetailService, coinListService, coinPriceService } from "../../services";

export const getCoinDetails = async (req: Request, res: Response) => {
    try {
        const symbol: string = req.query.symbol as string
        if(!symbol) return res.status(422).json(responseHandler(null, null, Error('symbol not found')))
        const { coin } = await coinDetailService(symbol)
        const { price } = await coinPriceService(symbol)
         res.status(200).json(responseHandler('Coin details fetched successfully', {...coin, ...price}))
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const getPrice = async (req: Request, res: Response) => {
    try {
        const symbol: string = req.query.symbol as string
        if(!symbol) return res.status(422).json(responseHandler(null, null, Error('symbol not found')))
        const { price } = await coinPriceService(symbol)
         res.status(200).json(responseHandler('Coin price fetched successfully', price))
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const getTokenList = async (req: Request, res: Response) => {
    try {
        const { coinList } = await coinListService()
         res.status(200).json(responseHandler('Coin details fetched successfully', coinList))
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const dexExchangePrice = async (req: Request, res: Response) => {
  try {

    const addressOne = req.query.addressOne as string
    const addressTwo = req.query.addressTwo as string
    if(!addressOne || !addressTwo) return res
    .status(400)
    .json(responseHandler(null, null, Error('addressOne or addressTwo query parameter is not specified')))

    if(addressOne === addressTwo) return res
    .status(400)
    .json(responseHandler(null, null, Error('addressOne and addressTwo query parameter can not be the same address')))
     
    const tokenPrice1 = await Moralis.EvmApi.token.getTokenPrice({
      address: addressOne,
    });

    const tokenPrice2 = await Moralis.EvmApi.token.getTokenPrice({
      address: addressTwo,
    });

    res.status(200).json(responseHandler(
      "Dex exchange price fetched successfully",
      {
        tokenOne: tokenPrice1.raw,
        tokenTwo: tokenPrice2.raw,
        ratio: tokenPrice1.raw.usdPrice/tokenPrice2.raw.usdPrice
      }))

  } catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error(error.message)));
  }
}


