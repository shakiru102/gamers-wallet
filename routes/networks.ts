import { Router } from "express";
import { networkChains, networkTestChains } from "../controllers/networks";

const router = Router();
router.get('/networks', networkChains)
router.get('/networks-test', networkTestChains)
export default router