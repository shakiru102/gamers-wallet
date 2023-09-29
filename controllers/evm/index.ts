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
  EvmChain.PALM
];

const testChains = [
  {
    chain: "eth Gorli",
    chain_id: "0x5",
    rpcUrl: ['https://goerli.infura.io/v3/${GOERLI_API_KEY}']
  },
  {
    chain: "eth Sepolia",
    chain_id: "0xaa36a7",
    rpcUrl: ['https://sepolia.infura.io/v3/${SEPOLIA_API_KEY}']
  },
  {
    chain: "polygon Mumbai",
    chain_id: "0x13881",
    rpcUrl: []
  },
  {
    chain: "bsc Testnet",
    chain_id: "0x61",
    rpcUrl: []
  }
]

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
        const Walletaddress = [
          {
            name: "evm",
            walletDetails: { 
              address: verifySeedPhrase.address,
              privatekey: verifySeedPhrase.privateKey,
              ...( ensResponse && { 
                ens_name: ensResponse.raw.name
               })
            }
          }
        ] 
        res.status(200).json(responseHandler(
            "Seed phrase verified",
            Walletaddress
        ));
    } catch (error: any) {
        res.status(400).json(responseHandler(null, null, Error(error.message)))
    }
}

export const getWalletChains = async (req: Request, res: Response) => {
    try {
        
          const address: string = req.query.address as string
          if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

        
          const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
            address,
            chains
          });

          let data: any = [] 
          for (let chain of response.raw.active_chains) {
            let balance = await Moralis.EvmApi.balance.getNativeBalance({
              address,
               chain: chain.chain_id
            });
            data.push({...chain, balance: balance.raw.balance})
          }
          res.status(200).json(responseHandler(
            "Wallet chain fetched successfully",
            {
              address: response.raw.address,
              active_chains: data
            }
          ))
    } catch (error: any) {
     res.status(422).json(responseHandler(null, null, Error(error.message)));
    }

}

export const getWalletTestnetChains = async (req: Request, res: Response) => {
  res.status(200).json(responseHandler(
    "Wallet chain fetched successfully",
    testChains
  ))
}

export const nativeTestChains = async (address: string) => {
  try {
    
      

        let data: any = [] 
        for (let chain of testChains) {
          let balance = await Moralis.EvmApi.balance.getNativeBalance({
            address,
             chain: chain.chain_id
          });
                    
          data.push({...chain, balance: balance.raw.balance, symbol: chain.chain, wallet_address: address })
        }
        
       return data
  } catch (error: any) {
   throw new Error(error.message)
  }

}

export const walletAddressTestTokensBalance = async (req: Request, res: Response) => {
    
  try {
      const address: string = req.query.address as string
      const nativeChainsData =  await nativeTestChains(address)
  if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

  
  for (let chain of testChains){
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain: chain.chain_id
    });
     
    response.raw.forEach(token => nativeChainsData.push({...token, wallet_address: address, rpcUrl: chain.rpcUrl }))
  }
    

    res.status(200).json(responseHandler(
      "Wallet token balances fetched successfully",
      nativeChainsData
    ))
  } catch (error: any) {
      res.status(422).json(responseHandler(null, null, Error(error.message)));
  }
  

}



export const nativeChains = async (address: string) => {
  try {
      
        const response = await Moralis.EvmApi.wallets.getWalletActiveChains({
          address,
          chains
        });
        const activeChains = response.raw.active_chains.map((chain, index: number) => chain.chain === 'arbitrum' ? ({
          ...chain,
          rpcUrl: chains[index].rpcUrls,
          name: "ARBITRUM",
          symbol: 'ARB',
          decimals: chains[index].currency?.decimals,
          wallet_address: address
        }): ({
          ...chain, 
          ...chains[index].currency,
          rpcUrl: chains[index].rpcUrls,
          wallet_address: address
        }))
        let data: any = [] 
        for (let chain of activeChains) {
          let balance = await Moralis.EvmApi.balance.getNativeBalance({
             address,
             chain: chain.chain_id
          });

          const coinData = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/info?symbol=${chain.symbol}`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })
           const coinPrice = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${chain.symbol}`,{
            headers: {
              'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
            }
           })

           const { [chain.symbol as string]: coin } = coinData.data.data
           const { [chain.symbol as string]: price } = coinPrice.data.data
  
            data.push({
              ...chain,
               balance: balance.raw.balance, 
               logo: coin.logo,
               quote: price.quote
              })
        }
        
       return data
  } catch (error: any) {
   throw new Error(error.message)
  }

}
export const walletAddressTokensBalance = async (req: Request, res: Response) => {
    
    try {
        const address: string = req.query.address as string
        const nativeChainsData =  await nativeChains(address)
    if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));

    
    for (let chain of chains){
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address,
        chain
      });
      
      response.raw.forEach(async token => {
        const coinPrice = await axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${token.symbol}`,{
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        }
       })
       const { [token.symbol as string]: price } = coinPrice.data.data
        nativeChainsData.push({...token, rpcUrl: chain.rpcUrls, wallet_address: address, quote: price })
      })
    }
      

      res.status(200).json(responseHandler(
        "Wallet token balances fetched successfully",
        nativeChainsData
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
    const cursors: string = req.body.cursors as string
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
  
  let allNft: any = []
  let allCursors = []

  for(let chain in chains) {
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: chains[chain],
      limit: 100,
      normalizeMetadata: true,
      ...( cursors && { cursor: cursors[chain] })
      
    });

    allNft = [...allNft, ...nfts.raw.result]
    allCursors.push(nfts.raw.cursor)
    
  }


  res.status(200).json(responseHandler(
    "Wallet nft fetched successfully",
    allNft
  ))
} catch (error: any) {
    res.status(422).json(responseHandler(null, null, Error(error.message)));
}
}

export const getWalletEvmNftTest = async (req: Request, res: Response) => {
  try {
    const address: string = req.query.address as string
    const cursors: string[] = req.body.cursors as string[]
if(!address) return res.status(422).json(responseHandler(null, null, Error("address parameter is required")));
  
  let allNft: any = []
  let allCursors = []

  for(let chain in testChains) {
    const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain: testChains[chain].chain_id,
      limit: 100,
      normalizeMetadata: true,
      ...( cursors && { cursor: cursors[chain] })
      
    });

    allNft = [...allNft, ...nfts.raw.result]
    allCursors.push(nfts.raw.cursor)
    
  }


  res.status(200).json(responseHandler(
    "Wallet nft fetched successfully",
    {
      cursors: allCursors,
      nfts: allNft
    }
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
      const { password, keystore } =  req.body
      if(!keystore )
      return res.status(422).json(responseHandler(null, null, 
       Error("keystore is required")
        ))
        if(!password)
      return res.status(422).json(responseHandler(null, null, 
       Error("password is required")
        ))

        const data = JSON.parse(`${keystore}`)
        
        fs.writeFileSync('uploads/keystore.json', JSON.stringify(data), 'utf8')

        const keyStoreObj = fs.readFileSync('uploads/keystore.json', 'utf-8')
        const wallet = await ethers.Wallet.fromEncryptedJson(keyStoreObj, password)
        fs.unlinkSync('uploads/keystore.json')

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