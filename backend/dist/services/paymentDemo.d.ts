export declare const paymentDemoService: {
    processPayment(orderId: string, amount: number, method: string): Promise<{
        success: boolean;
        transactionId: string;
        message: string;
        timestamp: string;
    }>;
    processBkashPayment(orderId: string, amount: number, phone: string): Promise<{
        success: boolean;
        transactionId: string;
        paymentId: string;
        message: string;
        instructions: string;
    }>;
    processNagadPayment(orderId: string, amount: number, phone: string): Promise<{
        success: boolean;
        transactionId: string;
        invoice: string;
        message: string;
        instructions: string;
    }>;
};
//# sourceMappingURL=paymentDemo.d.ts.map