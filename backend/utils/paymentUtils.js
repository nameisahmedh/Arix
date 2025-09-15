import { clerkClient } from "@clerk/express";

export const hasValidPayment = async (userId) => {
  try {
    const user = await clerkClient.users.getUser(userId);
    
    // Check if user has Premium plan
    const subscriptions = user.publicMetadata?.subscriptions || [];
    const hasActivePremium = subscriptions.some(sub => 
      sub.status === 'active' && sub.plan === 'premium'
    );
    
    // Check for test payment indicators
    const hasTestPayment = user.privateMetadata?.testPayment === true ||
                          user.privateMetadata?.paymentMethod === 'test_card';
    
    return hasActivePremium || hasTestPayment;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

export const markTestPayment = async (userId) => {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        testPayment: true,
        paymentMethod: 'test_card',
        paymentDate: new Date().toISOString()
      }
    });
    return true;
  } catch (error) {
    console.error('Error marking test payment:', error);
    return false;
  }
};