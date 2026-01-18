import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
class AuthUtils {
    // Generate JWT token
    static generateToken(payload) {
        const JWT_SECRET = process.env.JWT_SECRET;
        const expiresIn = Number(process.env.JWT_EXPIRE) || 7 * 24 * 60 * 60; // 7 days in seconds
        const options = { expiresIn };
        return jwt.sign(payload, JWT_SECRET, options);
    }
    // Verify JWT token
    static verifyToken(token) {
        const JWT_SECRET = process.env.JWT_SECRET;
        try {
            return jwt.verify(token, JWT_SECRET);
        }
        catch {
            return null;
        }
    }
    // Hash password
    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    // Compare password
    static async comparePassword(candidatePassword, hashedPassword) {
        return bcrypt.compare(candidatePassword, hashedPassword);
    }
    // Generate refresh token
    static generateRefreshToken(payload) {
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        const options = { expiresIn: "30d" };
        return jwt.sign(payload, JWT_REFRESH_SECRET, options);
    }
    // Verify refresh token
    static verifyRefreshToken(token) {
        const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET);
        }
        catch {
            return null;
        }
    }
}
// Authentication middleware
export const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({ message: "Authentication required" });
            return;
        }
        const decoded = AuthUtils.verifyToken(token);
        if (!decoded) {
            res.status(401).json({ message: "Invalid or expired token" });
            return;
        }
        // Attach user info to request
        req.user = decoded;
        next();
    }
    catch {
        res.status(401).json({ message: "Authentication failed" });
    }
};
// Admin authorization middleware
export const authorizeAdmin = (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }
    if (user.role !== "admin") {
        res.status(403).json({ message: "Admin access required" });
        return;
    }
    next();
};
export default AuthUtils;
//# sourceMappingURL=auth.js.map