export declare class BkashService {
    private config;
    private token;
    private tokenExpires;
    constructor();
    private getToken;
    createPayment(orderId: string, amount: number): Promise<{
        paymentID: any;
        bkashURL: any;
        success: boolean;
    }>;
    executePayment(paymentID: string): Promise<any>;
    queryPayment(paymentID: string): Promise<any>;
    verifyCallback(data: any): boolean;
}
export declare const bkashService: BkashService;
//# sourceMappingURL=bkash.service.d.ts.map