import { EvmChain } from "@moralisweb3/common-evm-utils";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";
import { getChainNode } from "../../services";
import { ethers } from "ethers";
import { ChainIdProps } from "../../types";
import axios from "axios";

const chains = [
    EvmChain.ETHEREUM,
    EvmChain.ARBITRUM,
    EvmChain.AVALANCHE,
    EvmChain.BSC,
    EvmChain.CRONOS,
    EvmChain.FANTOM,
    EvmChain.POLYGON,
    EvmChain.PALM,
    EvmChain.OPTIMISM,
    // EvmChain.RONIN
  ];
  
  const testChains = [
    {
      chain: "eth Gorli",
      name: "eth Gorli",
      chain_id: "0x5",
      rpcUrl: ['https://goerli.infura.io/v3/${GOERLI_API_KEY}']
    },
    {
      chain: "eth Sepolia",
      name: "eth Sepolia",
      chain_id: "0xaa36a7",
      rpcUrl: ['https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}']
    },
    {
      chain: "polygon Mumbai",
      name: "polygon Mumbai",
      chain_id: "0x13881",
      rpcUrl: []
    },
    {
      chain: "bsc Testnet",
      name: "bsc Testnet",
      chain_id: "0x61",
      rpcUrl: []
    }
  ]

export const networkChains = async (req: Request, res: Response) => {

    let allChains: object[] = []
    console.log(chains[0]);
    // const { coin } = await coinDetailService('eth')
    for (let chain of chains) {

        allChains.push({
           chain: chain.hex,
           ...chain.currency,
           rpcUrls: chain.rpcUrls,
           explorer: chain.explorer,
           name: chain.name,
          //  logo: chain.currency?.symbol.toLocaleLowerCase() === 'eth' ? coin.logo : null
        })
    }
     res.status(200).json(responseHandler(
        'Network Chains fetched successfully',
        allChains
     ))
}

export const networkTestChains = async (req: Request, res: Response) => {

   res.status(200).json(responseHandler(
      'Network Chains fetched successfully',
      testChains
   ))
}

export const importNetworkTokens = async (req: Request, res: Response) => {
  try {
    const { chainId, tokenAddress } = req.query as { chainId: ChainIdProps; tokenAddress: string }
    const tokenAbi = [
      'function name() view returns (string)',
      'function symbol() view returns (string)',
      'function decimals() view returns (uint8)',
      'function totalSupply() view returns (uint256)'
    ];
    
    const rpcUrl = getChainNode(chainId)
    const provider =  new ethers.JsonRpcProvider(rpcUrl)
    const contract = new ethers.Contract(tokenAddress, tokenAbi, provider)
    const name = await contract.name()
    const symbol = await contract.symbol()
    const decimals = Number(await contract.decimals())

    res.status(200).json(responseHandler(
      'Token details fetched successfully',
      { 
        name: name.toString() ,
        symbol: symbol.toString(),
        decimals,
        chain: chainId,
        tokenAddress 
      }
    ))

  } catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error("Could not resolve token address")));
  }
}

export const networkTokens = async (req: Request, res: Response) => {
  try {
    
    const network: string = req.query.network as string
  const apiEndpoint = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2';
  const graphqlQuery = `
{
  tokens(where: { id: "${`0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee`.toLowerCase()}" }) {
    id
    symbol
    name
    decimals
  }
}
`;

const response = await axios.post(apiEndpoint, {
  query: graphqlQuery
})

res.status(200).json(responseHandler(
  'Network tokens fetched successfully', 
  response.data
  ));
  } catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error(error.message)));
  }
 
}