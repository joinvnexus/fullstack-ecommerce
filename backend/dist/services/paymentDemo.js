export const paymentDemoService = {
    // Simulate payment processing
    async processPayment(orderId, amount, method) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Generate fake transaction ID
        const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        // Randomly succeed (80%) or fail (20%) for demo
        const isSuccess = Math.random() > 0.2;
        return {
            success: isSuccess,
            transactionId,
            message: isSuccess
                ? `Payment of $${amount} processed successfully via ${method}`
                : `Payment failed. Please try again.`,
            timestamp: new Date().toISOString(),
        };
    },
    // Simulate bKash payment
    async processBkashPayment(orderId, amount, phone) {
        console.log(`Simulating bKash payment for order ${orderId}`);
        console.log(`Amount: ${amount}, Phone: ${phone}`);
        // Simulate bKash API call
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            success: true,
            transactionId: `BKASH${Date.now()}`,
            paymentId: `PID${Date.now()}`,
            message: 'bKash payment completed successfully',
            instructions: 'Check your bKash app for confirmation',
        };
    },
    // Simulate Nagad payment
    async processNagadPayment(orderId, amount, phone) {
        console.log(`Simulating Nagad payment for order ${orderId}`);
        console.log(`Amount: ${amount}, Phone: ${phone}`);
        // Simulate Nagad API call
        await new Promise(resolve => setTimeout(resolve, 3000));
        return {
            success: true,
            transactionId: `NAGAD${Date.now()}`,
            invoice: `INV${Date.now()}`,
            message: 'Nagad payment completed successfully',
            instructions: 'Check your Nagad app for confirmation',
        };
    },
};
//# sourceMappingURL=paymentDemo.js.map