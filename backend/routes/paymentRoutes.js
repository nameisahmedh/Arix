import express from "express";
import { auth } from "../middleware/auth.js";
import { markTestPayment } from "../utils/paymentUtils.js";

const paymentRouter = express.Router();

paymentRouter.post('/test-payment', auth, async (req, res) => {
  try {
    const { userId } = req.auth();
    
    const success = await markTestPayment(userId);
    
    if (success) {
      res.json({ 
        success: true, 
        message: "Test payment processed successfully" 
      });
    } else {
      res.json({ 
        success: false, 
        message: "Failed to process test payment" 
      });
    }
  } catch (error) {
    res.json({ 
      success: false, 
      message: error.message 
    });
  }
});

export default paymentRouter;