"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.settings = {
    appName: 'zkCAP',
    appEnv: process.env.NODE_ENV || 'development',
    projectName: 'zkCAP API',
    apiV1Str: '/api',
    debug: (process.env.DEBUG || 'false').toLowerCase() === 'true',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/zkcap',
    githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET || 'super_secret_webhook_key',
    githubApiToken: process.env.GITHUB_API_TOKEN || '',
    phalaTeeEndpoint: process.env.PHALA_TEE_ENDPOINT || 'http://localhost:9090/invoke',
    teeCallbackBaseUrl: process.env.TEE_CALLBACK_BASE_URL || 'http://localhost:8000',
    teeEvaluationTimeout: parseInt(process.env.TEE_EVALUATION_TIMEOUT || '120', 10),
    reclaimApiKey: process.env.RECLAIM_API_KEY || '',
    enableZktlsProofs: (process.env.ENABLE_ZKTLS_PROOFS || 'false').toLowerCase() === 'true',
    githubClientId: process.env.GITHUB_CLIENT_ID || '',
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
    jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
    jwtExpiryHours: parseInt(process.env.JWT_EXPIRY_HOURS || '72', 10),
    midnightContractAddress: process.env.MIDNIGHT_CONTRACT_ADDRESS || '',
    midnightRpcEndpoint: process.env.MIDNIGHT_RPC_ENDPOINT || 'https://indexer.testnet.midnight.network/graphql',
    midnightRpcWebsocket: process.env.MIDNIGHT_RPC_WEBSOCKET || 'wss://indexer.testnet.midnight.network/graphql',
    midnightProofServer: process.env.MIDNIGHT_PROOF_SERVER || 'http://localhost:6300',
};
