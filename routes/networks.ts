import { Router } from "express";
import { importNetworkTokens, networkChains, networkTestChains, networkTokens } from "../controllers/networks";

const route = Router();
route.get('/networks', networkChains)
route.get('/networks-test', networkTestChains)
route.get('/import-network-token', importNetworkTokens)
route.get('/network-tokens', networkTokens)
export default route