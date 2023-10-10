import { Router } from "express";
import { getPriceHistoryBlockNumber, getPriceHistoryTokenPrice, getWalletChainDetails, getWalletEvmNft, getWalletEvmNftTest, getWalletNativeBalance, getWalletTransactionsHistory, walletAddressTestTokensBalance, walletAddressTokensBalance } from "../controllers/evm";
import { upload } from "../utils/upload";

const route = Router()

// route.get('/initialize-seed-phrase', initializeSeedPhrase)
// route.post('/verify-seed-phrase', verifySeedPhrase)
// route.get('/wallet-chains', getWalletChains)
// route.get('/wallet-chains-testnet', getWalletTestnetChains)
route.post('/wallet-token-balances', walletAddressTokensBalance)
route.post('/wallet-token-test-balances', walletAddressTestTokensBalance)
route.get('/wallet-native-balance', getWalletNativeBalance)
route.post('/wallet-evm-nfts', getWalletEvmNft)
route.post('/wallet-evm-nfts-test', getWalletEvmNftTest)
route.post('/wallet-evm', getWalletChainDetails)
route.get('/wallet-transactions', getWalletTransactionsHistory)
route.post('/price-history-block-number', getPriceHistoryBlockNumber)
route.post('/price-history-token-price', getPriceHistoryTokenPrice)
// route.get('/wallet/:privateKey/evm', getWalletByPrivateKey)
// route.post('/wallet/key-store-file/evm', upload.single('file'), getWalletByKeyStoreJsonFile)


export default route