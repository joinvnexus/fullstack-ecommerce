export declare const ROLE_PERMISSIONS: Record<string, string[]>;
export declare const hasPermission: (role: string, resource: string, action: string) => boolean;
export declare const getRolePermissions: (role: string) => string[];
export declare const AVAILABLE_ROLES: string[];
export declare const PERMISSION_GROUPS: {
    products: string[];
    orders: string[];
    customers: string[];
    analytics: string[];
    settings: string[];
};
//# sourceMappingURL=rolePermissions.d.ts.map