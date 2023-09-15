import { Router } from "express";
import { getWalletByKeyStoreJsonFile, getWalletByPrivateKey , getWalletChainDetails, getWalletChains, getWalletEvmNft, getWalletNativeBalance, getWalletTestnetChains, initializeSeedPhrase, verifySeedPhrase, walletAddressTokensBalance } from "../controllers/evm";
import { upload } from "../utils/upload";

const route = Router()

route.get('/initialize-seed-phrase', initializeSeedPhrase)
route.post('/verify-seed-phrase', verifySeedPhrase)
route.get('/wallet-chains', getWalletChains)
route.get('/wallet-chains-testnet', getWalletTestnetChains)
route.get('/wallet-token-balances', walletAddressTokensBalance)
route.get('/wallet-native-balances', getWalletNativeBalance)
route.get('/wallet-evm-nfts', getWalletEvmNft)
route.get('/wallet-evm', getWalletChainDetails)
route.get('/wallet/:privateKey/evm', getWalletByPrivateKey)
route.post('/wallet/key-store-file/evm', upload.single('file'), getWalletByKeyStoreJsonFile)


export default route