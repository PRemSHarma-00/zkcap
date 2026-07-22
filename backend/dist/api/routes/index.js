"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const projects_1 = __importDefault(require("./projects"));
const commits_1 = __importDefault(require("./commits"));
const attestations_1 = __importDefault(require("./attestations"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.use('/projects', projects_1.default);
router.use('/commits', commits_1.default);
router.use('/attestations', attestations_1.default);
router.use('/auth', auth_1.default);
router.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
exports.default = router;
