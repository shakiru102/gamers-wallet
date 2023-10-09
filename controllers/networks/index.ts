import { EvmChain } from "@moralisweb3/common-evm-utils";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";
import { coinDetailService } from "../../services";

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