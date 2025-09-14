import { clerkClient } from "@clerk/express";
// Middleware to check userid and hasPremiumPlan

// In middleware/auth.js

export const checkPlan = async (req, res, next) => {
  console.log("--- RUNNING DEBUG MIDDLEWARE ---");

  // Create a fake req.auth function that returns a test user ID
  req.auth = () => ({
    userId: "user_debug_test_12345"
  });

  // Force the plan to be Premium
  req.pla = "u:premium";

  console.log("✅ Forced user to be Premium. Calling controller...");
  
  next(); // Go to the generateImage controller
};
export const auth = async (req,res,next)=>{
    try {

        const {userId, has} = await req.auth();
        const hasPremiumPlan = await has({plan: 'Premium'});
        
        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        }else{
            await clerkClient.users.updateUserMetadata(userId,{
                privateMetadata:{
                    free_usage: 0
                }
            })

            req.free_usage = 0;
        }

        

        req.plan = hasPremiumPlan ? 'Premium' : 'Free';
        next()

    } catch (error) {
        res.json({success:false,message: error.message})
        
    }
}

export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};
