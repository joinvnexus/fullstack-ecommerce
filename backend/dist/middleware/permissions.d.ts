import type { Request, Response, NextFunction } from 'express';
export declare const checkPermission: (resource: string, action: string) => (req: Request, res: Response, next: NextFunction) => void;
export declare const checkAnyPermission: (permissions: Array<{
    resource: string;
    action: string;
}>) => (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
export declare const validateRole: (role: string) => boolean;
export declare const validateRoleChange: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=permissions.d.ts.map