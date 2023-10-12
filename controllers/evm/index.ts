import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";
import Moralis from 'moralis'
import { EvmChain } from "@moralisweb3/common-evm-utils";
import axios from "axios";
import { coinPriceService } from "../../services";


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
    const tokenAddresses: {
      contract_address: string;
      chain: string;
    }[] = req.body.tokenAddresses
    if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

    let walletTokens: any[] = []

    for(let token of tokenAddresses) {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain: token.chain,
        tokenAddresses: [token.contract_address]
      });
      if(response.raw.length) {
        const { price } = await coinPriceService(response.raw[0].symbol)
       walletTokens.push({chain: token.chain, ...response.raw[0],  quote: price })
       }
    }
  
  res.status(200).json(responseHandler(
    "Wallet token balances fetched successfully",
    walletTokens
  ))
  } catch (error: any) {
      res.status(422).json(responseHandler(null, null, Error(error.message)));
  }
  

}

export const walletAddressTokensBalance = async (req: Request, res: Response) => {
    
    try {
        const address: string = req.query.address as string
        const tokenAddresses: {
          contract_address: string;
          chain: string;
        }[] = req.body.tokenAddresses
        if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

        let walletTokens: any[] = []

        for(let token of tokenAddresses) {
          const response = await Moralis.EvmApi.token.getWalletTokenBalances({
            address,
            chain: token.chain,
            tokenAddresses: [token.contract_address]
          });
           if(response.raw.length) {
            const { price } = await coinPriceService(response.raw[0].symbol)
           walletTokens.push({chain: token.chain, ...response.raw[0],  quote: price })
           }
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

