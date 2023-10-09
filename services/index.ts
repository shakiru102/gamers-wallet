import axios from "axios"

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

export const getChainNode = async (chainId: string) => {
    
}