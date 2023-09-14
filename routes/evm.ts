import { Router } from "express";
import { getWalletChains, getWalletEvmNft, getWalletNativeBalance, getWalletTestnetChains, initializeSeedPhrase, verifySeedPhrase, walletAddressTokensBalance } from "../controllers/evm";

const route = Router()

route.get('/initialize-seed-phrase', initializeSeedPhrase)
route.post('/verify-seed-phrase', verifySeedPhrase)
route.get('/wallet-chains', getWalletChains)
route.get('/wallet-chains-testnet', getWalletTestnetChains)
route.get('/wallet-token-balances', walletAddressTokensBalance)
route.get('/wallet-native-balances', getWalletNativeBalance)
route.get('/wallet-evm-nfts', getWalletEvmNft)

export default route