"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./core/config");
const routes_1 = __importDefault(require("./api/routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(config_1.settings.apiV1Str, routes_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`${config_1.settings.appName} listening on port ${port}`);
});
