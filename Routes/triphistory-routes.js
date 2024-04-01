import express from 'express'
import { HistoryAdd,getHistory } from '../Controllers/triphistory-controller.js';
const router = express.Router();


router.post('/historyadd',HistoryAdd);
router.post('/getHistory',getHistory);






export default router