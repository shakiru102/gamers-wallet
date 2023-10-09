import { EvmChain } from "@moralisweb3/common-evm-utils"
import axios from "axios"
import { ChainIdProps } from "../types"


export const coinDetailService = async (symbol: string) => {
   try {
    const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${symbol}`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
           const { [symbol.toUpperCase()]: coin } = coinData.data.data
           return { coin }
   } catch (error: any) {
    throw error
   }
} 

export const coinPriceService = async (symbol: string) => {
    try {
        const coinPrice = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
           const { [symbol.toUpperCase()]: price } = coinPrice.data.data 
           return { price }
    } catch (error: any) {
        throw error
    }      
}

export const getChainNode = (chainId: ChainIdProps) => {
  switch (chainId) {
    case '0xa4b1':
       return 'https://arbitrum-one.publicnode.com'
    case '0xa86a':
        return 'https://avalanche-c-chain.publicnode.com'
    case '0x38':
        return 'https://bsc.publicnode.com'
    case '0x19':
        return 'https://cronos-evm.publicnode.com'
    case '0xfa':
        return 'https://fantom.publicnode.com'  
    case '0x89':
        return 'https://polygon-bor.publicnode.com'    
    case '0x2a15c308d':
        return 'https://palm-mainnet.infura.io/v3/33886901f1b946fda6b6ad15c7b66363'  
    case '0xa':
        return 'https://optimism.publicnode.com'   
    default:
        return 'https://ethereum.publicnode.com';
  }
}