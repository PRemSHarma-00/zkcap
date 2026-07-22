"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = exports.verifyToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const createToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, config_1.settings.jwtSecret, {
        expiresIn: `${config_1.settings.jwtExpiryHours}h`,
        algorithm: config_1.settings.jwtAlgorithm,
    });
};
exports.createToken = createToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, config_1.settings.jwtSecret);
};
exports.verifyToken = verifyToken;
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ detail: 'Not authenticated' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, exports.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ detail: 'Invalid or expired token' });
        return;
    }
};
exports.requireAuth = requireAuth;
