export declare class NagadService {
    private config;
    constructor();
    private generateSignature;
    initializePayment(orderId: string, amount: number): Promise<{
        paymentReferenceId: any;
        checkoutURL: any;
        success: boolean;
    }>;
    verifyPayment(paymentRefId: string): Promise<{
        success: boolean;
        status: any;
        transactionId: any;
        message?: never;
    } | {
        success: boolean;
        status: any;
        message: any;
        transactionId?: never;
    }>;
}
export declare const nagadService: NagadService;
//# sourceMappingURL=nagad.service.d.ts.map