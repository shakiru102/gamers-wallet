import { EvmChain } from "@moralisweb3/common-evm-utils"
import axios from "axios"
import { ChainIdProps, SymbolProps } from "../types"


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
    default:
        return 'https://ethereum.publicnode.com';
  }
}
export const coinListService = async () => {
    try {
        const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
         return { coinList: coinData.data.data }  
    } catch (error: any) {
        throw error
    }
}

export const getChainId = (symbol: SymbolProps) => {
   switch (symbol) {
    case 'ETH':
        return '0x1';
    case 'ARB': 
        return '0xa4b1';    
    case 'AVAX': 
        return '0xa86a'; 
    case 'BNB': 
        return '0x38';
    case 'CRO': 
        return '0x19';
    case 'FTM': 
        return '0xfa';
    case 'MATIC': 
        return '0x89';   
    default:
        return '0x2a15c308d';
   }
}