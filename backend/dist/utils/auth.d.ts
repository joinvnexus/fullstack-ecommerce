import type { Request, Response, NextFunction } from "express";
export interface JwtPayload {
    userId: string;
    email: string;
    role: "customer" | "admin";
}
declare class AuthUtils {
    static generateToken(payload: JwtPayload): string;
    static verifyToken(token: string): JwtPayload | null;
    static hashPassword(password: string): Promise<string>;
    static comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean>;
    static generateRefreshToken(payload: JwtPayload): string;
    static verifyRefreshToken(token: string): JwtPayload | null;
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorizeAdmin: (req: Request, res: Response, next: NextFunction) => void;
export default AuthUtils;
//# sourceMappingURL=auth.d.ts.map