import { ethers } from "ethers";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";
import Moralis from 'moralis'
import { EvmChain } from "@moralisweb3/common-evm-utils";
import fs from 'fs'
import axios from "axios";


const chains = [
  EvmChain.ARBITRUM,
  EvmChain.AVALANCHE,
  EvmChain.BSC,
  EvmChain.CRONOS,
  EvmChain.ETHEREUM,
  EvmChain.FANTOM,
  EvmChain.POLYGON,
  EvmChain.PALM,
  EvmChain.OPTIMISM,
];

// const testChains = [
//   {
//     chain: "eth Gorli",
//     chain_id: "0x5",
//     rpcUrl: ['https://goerli.infura.io/v3/${GOERLI_API_KEY}']
//   },
//   {
//     chain: "eth Sepolia",
//     chain_id: "0xaa36a7",
//     rpcUrl: ['https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}']
//   },
//   {
//     chain: "polygon Mumbai",
//     chain_id: "0x13881",
//     rpcUrl: []
//   },
//   {
//     chain: "bsc Testnet",
//     chain_id: "0x61",
//     rpcUrl: []
//   }
// ]


export const walletAddressTestTokensBalance = async (req: Request, res: Response) => {
    
  try {
      const address: string = req.query.address as string
      const chainId: string = req.query.chainId as string
      const tokenAddresses: string[] = req.body.tokenAddresses
  if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
  
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain: chainId,
      tokenAddresses: tokenAddresses || []
    });
     
    

    res.status(200).json(responseHandler(
      "Wallet token balances fetched successfully",
     response.toJSON()
    ))
  } catch (error: any) {
      res.status(422).json(responseHandler(null, null, Error(error.message)));
  }
  

}

export const walletAddressTokensBalance = async (req: Request, res: Response) => {
    
    try {
        const address: string = req.query.address as string
        const chainId = req.query.chainId as string
        const tokenAddresses: string[] = req.body.tokenAddresses
        if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain: chainId,
        tokenAddresses: tokenAddresses || []
      });

      let walletTokens: any[] = []

      for (let token of response.raw) {
          const coinPrice = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${token.symbol}`,{
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        }})
      const { [token.symbol as string]: price } = coinPrice.data.data
      walletTokens.push({...token,  quote: price })
      
      }
      
      

      res.status(200).json(responseHandler(
        "Wallet token balances fetched successfully",
        walletTokens
      ))
    } catch (error: any) {
        res.status(422).json(responseHandler(null, null, Error(error.message)));
    }
    

}

export const getWalletNativeBalance = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

const chainId: string = req.query.chainId as string

  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    ...(chainId && { chain: chainId } )
  });

  res.status(200).json(responseHandler(
    "Wallet native balance fetched successfully",
    { balance: response.raw.balance }
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletEvmNft = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
    const cursor: string = req.body.cursor
    const chainId = req.query.chainId as string
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
  
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: chainId || '0x1',
      limit: 100,
      normalizeMetadata: true,
     ...( cursor && { cursor  })
      
    });


  res.status(200).json(responseHandler(
    "Wallet nft fetched successfully",
    nfts
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletEvmNftTest = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
    const cursor: string = req.body.cursor
    const chainId = req.query.chainId as string
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
  
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: chainId || '0x1',
      limit: 100,
      normalizeMetadata: true,
     ...( cursor && { cursor  })
      
    });


  res.status(200).json(responseHandler(
    "Wallet nft fetched successfully",
    nfts
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletChainDetails = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
    const chainId: string = req.query.chainId as string
    const tokenAddresses: string[] = req.body.tokenAddresses
    if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

  const responseTokenBalance = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain: chainId || '0x1',
    tokenAddresses: tokenAddresses || []
  });

  const responseNativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    ...(chainId && { chain: chainId })
  });

  const responseNFTs = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    ...(chainId && { chain: chainId } ),
    normalizeMetadata: true
  });

  const data = {
    balance: responseNativeBalance.raw.balance,
    tokens: responseTokenBalance.toJSON(),
    nfts: responseNFTs.toJSON()
  }

  res.status(200).json(responseHandler(
    "Wallet token balances fetched successfully",
    data
  ))
} catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletTransactionsHistory = async (req: Request, res: Response) => {

  const { address, symbol, chainId, cursor } = req.query as { address: string, symbol: string, chainId: string, cursor?: string}
  if(!address) return res.status(400).json(responseHandler(null, null, Error('address query parameter is required')))
  if(!symbol) return res.status(400).json(responseHandler(null, null, Error('symbol query parameter is required')))
  if(!chainId) return res.status(400).json(responseHandler(null, null, Error('chainId query parameter is required')))
  let layerOneSymbol: null | string = null
   let chainDetails = null
  chains.forEach(chain => {
    // console.log(chain);
    
    if(chain.currency?.symbol === symbol.toUpperCase()) {
      layerOneSymbol = symbol 
    }
  })
  try {
    
    if(layerOneSymbol != null) {

      const response = await Moralis.EvmApi.transaction.getWalletTransactions({
        chain: chainId,
        address,
        ...(cursor && { cursor: cursor })
      });

     return res.status(200).json(responseHandler(
        "Wallet transactions fetched successfully",
        response.toJSON()
      ))
    
    }
    
    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      chain: chainId,
      address,
     ...(cursor && { cursor: cursor })
    });

    return res.status(200).json(responseHandler(
      "Wallet transactions fetched successfully",
      {
        ...response.toJSON(),
        result: response.raw.result.filter((token) => token.token_symbol.toUpperCase() === symbol.toUpperCase())
      }
    ))

  } catch (error: any) {
    
    return res.status(422).json(responseHandler(null, null, Error(error.message)))
  }

  
}

export const getPriceHistoryBlockNumber = async (req: Request, res: Response) => {
  const dateHistory = req.body.dateHistory as string[]
  const chainId = req.query.chainId as string
  if(!dateHistory || !dateHistory.length) return res.status(422).json(responseHandler(null, null, Error(`dateHistory cannot be an empty  array`)));
  
  let blockNumbers = []
  try {

    for(let i=0; i < dateHistory.length; i++) {
      const response = await Moralis.EvmApi.block.getDateToBlock({
        chain: chainId || '0x1',
        date: dateHistory[i]
      })

      blockNumbers.push(response.raw.block)
    }
    res.status(200).json(responseHandler(
      'Token price history fetched successfully',
      { blockNumbers }
    ))
  } catch (error: any) {
     res.status(400).json(responseHandler(null, null, Error(error.message)))
  }
}

export const getPriceHistoryTokenPrice = async (req: Request, res: Response) => {
  const blockNumbers = req.body.blockNumbers as number[]
  const chainId = req.query.chainId as string
  const address = req.query.token_address as string
  if(!address) return res.status(422).json(responseHandler(null, null, Error('token_address parameter is required')))
  if(!blockNumbers || !blockNumbers.length) return res.status(422).json(responseHandler(null, null, Error('blockNumbers is required and cannot be an empty array')))
  const tokenPrices = []

  try {
    for(let i = 0; i < blockNumbers.length; i++) {
      
      const response =  await Moralis.EvmApi.token.getTokenPrice({
        chain: chainId || '0x1',
        toBlock: blockNumbers[i],
        address,
        exchange: 'uniswap-v2'
      })

      tokenPrices.push(response.raw.usdPrice)
    }
    res.status(200).json(responseHandler(
      'Token price history fetched successfully',
      { tokenPrices }
    ))
  } catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error(error.message)))
  }
}

export const importNetworkTokens = async (req: Request, res: Response) => {
  try {
    const {  tokenAddress } = req.query as { chanId: string; tokenAddress: string }
    const tokenAbi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)'
    ];
    
    
    const provider =  new ethers.JsonRpcProvider('https://bsc.publicnode.com')
    const contract = new ethers.Contract(tokenAddress, tokenAbi, provider)
    const name = await contract.name()
    const symbol = await contract.symbol()
    const decimals = Number(await contract.decimals())

    res.status(200).json(responseHandler(
      'Token details fetched successfully',
      { 
        name: name.toString() ,
        symbol: symbol.toString(),
        decimals
      }
    ))

  } catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error(error.message)));
  }
}