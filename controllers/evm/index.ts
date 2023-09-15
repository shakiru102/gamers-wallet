import { ethers } from "ethers";
import { Request, Response } from "express";
import responseHandler from "../../utils/responseHandler";
import Moralis from 'moralis'
import { EvmChain } from "@moralisweb3/common-evm-utils";
import fs from 'fs'

export const initializeSeedPhrase = async (_: Request, res: Response) => {
   const seed =  ethers.Wallet.createRandom().mnemonic?.phrase
   res.status(200).json(responseHandler(
    "Seed phrase generated",
    { seedPhrase: seed } 
   ))
}

export const verifySeedPhrase = async (req: Request, res: Response) => {
    const { seedPhrase } = req.body
    if(!seedPhrase) return res.status(422).json(responseHandler(
        null,
        null,
        new Error("seedPhrase field is required")
         ))    
    try {
        const verifySeedPhrase = ethers.Wallet.fromPhrase(seedPhrase)
        if(!verifySeedPhrase) return res.status(400).json(responseHandler(null, null, new Error("Invalid seed phrase")));
        const ensResponse = await Moralis.EvmApi.resolve.resolveAddress({
          address: verifySeedPhrase.address,
        });
        const address = { 
          address: verifySeedPhrase.address,
          privatekey: verifySeedPhrase.privateKey,
          ...( ensResponse && { 
            ens_name: ensResponse.raw.name
           })
        }
        res.status(200).json(responseHandler(
            "Seed phrase verified",
            address
        ));
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const getWalletChains = async (req: Request, res: Response) => {
    try {
        
          const address: string = req.query.address as string
          if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
        
          const chains = [
            EvmChain.ARBITRUM,
            EvmChain.AVALANCHE,
            EvmChain.BSC,
            EvmChain.CRONOS,
            EvmChain.ETHEREUM,
            EvmChain.FANTOM,
            EvmChain.POLYGON,
            EvmChain.PALM,
            // EvmChain.OPTIMISM,
            // EvmChain.RONIN,
            // EvmChain.MUMBAI,
            // EvmChain.SEPOLIA,
            // EvmChain.ARBITRUM_TESTNET,
            // EvmChain.AVALANCHE_TESTNET,
            // EvmChain.BSC_TESTNET,
            // EvmChain.FANTOM_TESTNET,
            // EvmChain.GOERLI
          ];
        
          const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
            address,
            chains
          });
          res.status(200).json(responseHandler(
            "Wallet chain fetched successfully",
            response.toJSON()
          ))
    } catch (error: any) {
     res.status(422).json(responseHandler(null, null, Error(error.message)));
    }

}

export const getWalletTestnetChains = async (req: Request, res: Response) => {
  const testChains = [
    {
      chain: "eth Gorli",
      chain_id: "0x5"
    },
    {
      chain: "eth Sepolia",
      chain_id: "0xaa36a7"
    },
    {
      chain: "polygon Mumbai",
      chain_id: "0x13881"
    },
    {
      chain: "bsc Testnet",
      chain_id: "0x61"
    },
  ]

  res.status(200).json(responseHandler(
    "Wallet chain fetched successfully",
    testChains
  ))
}

export const walletAddressTokensBalance = async (req: Request, res: Response) => {
    
    try {
        const address: string = req.query.address as string
    if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

    const chainId: string = req.query.chainId as string
    
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        ...(chainId && { chain: chainId } )
      });

      res.status(200).json(responseHandler(
        "Wallet token balances fetched successfully",
        response.toJSON()
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
    response.toJSON()
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletEvmNft = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

const chainId: string = req.query.chainId as string

  const response = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    ...(chainId && { chain: chainId } ),
    normalizeMetadata: true
  });

  res.status(200).json(responseHandler(
    "Wallet nft fetched successfully",
    response.toJSON()
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletChainDetails = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

const chainId: string = req.query.chainId as string

  const responseTokenBalance = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    ...(chainId && { chain: chainId } )
  });

  const responseNativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    ...(chainId && { chain: chainId } )
  });

  const responseNFTs = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    ...(chainId && { chain: chainId } ),
    normalizeMetadata: true
  });

  const data = {
    balance: responseNativeBalance.toJSON(),
    tokens: responseTokenBalance.toJSON(),
    nfts: responseNFTs.toJSON()
  }

  res.status(200).json(responseHandler(
    "Wallet token balances fetched successfully",
    data
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletByPrivateKey = async (req: Request, res: Response) => {
  try {
    const privateKey = req.params.privateKey 
    const wallet = new ethers.Wallet(privateKey)

    const ensResponse = await Moralis.EvmApi.resolve.resolveAddress({
      address: wallet.address,
    });
    res.status(200).json(responseHandler(
      "Wallet address retrieved successfully",
      { 
        address: wallet.address,
        ...( ensResponse && { 
          ens_name: ensResponse.raw.name
         })
      }
    ))
  } catch (error: any) {
    res.status(400).json(responseHandler(null, null, Error(error.message)))
  }
}

export const getWalletByKeyStoreJsonFile = async (req: Request, res: Response) => {
   try {
      const { password } =  req.body
      if(!req.file)
      return res.status(422).json(responseHandler(null, null, 
       Error("key store json file is required")
        ))
        if(!password)
      return res.status(422).json(responseHandler(null, null, 
       Error("password is required")
        ))
        const keyStoreObj = fs.readFileSync(req.file.path, 'utf-8')
        const wallet = await ethers.Wallet.fromEncryptedJson(keyStoreObj, password)
        fs.unlinkSync(req.file.path)

        const ensResponse = await Moralis.EvmApi.resolve.resolveAddress({
          address: wallet.address,
        });
      
       res.status(200).json(responseHandler(
        "Json file decrypted successfully",
        {
          address: wallet.address,
          privateKey: wallet.privateKey,
          ...( ensResponse && { 
            ens_name: ensResponse.raw.name
           } )
        }
       ))
   } catch (error: any) {
      res.status(400).json(responseHandler(null, null, Error(error.message)))
   }
}