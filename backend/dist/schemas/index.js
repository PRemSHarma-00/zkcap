"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubWebhookPayloadSchema = exports.WebhookRepositorySchema = exports.WebhookCommitSchema = exports.WebhookAuthorSchema = exports.ProjectCreateSchema = exports.GitHubAuthRequestSchema = exports.AttestationCreateRequestSchema = exports.TEEExecutionSchema = exports.TEEEvaluationSchema = exports.VulnerabilitySchema = void 0;
const zod_1 = require("zod");
exports.VulnerabilitySchema = zod_1.z.object({
    type: zod_1.z.string(),
    severity: zod_1.z.string(), // "critical", "high", "medium", "low"
    description: zod_1.z.string(),
});
exports.TEEEvaluationSchema = zod_1.z.object({
    security_score: zod_1.z.number().min(0).max(100),
    pass_evaluation: zod_1.z.boolean(),
    vulnerabilities: zod_1.z.array(exports.VulnerabilitySchema).default([]),
    reasoning: zod_1.z.string(),
});
exports.TEEExecutionSchema = zod_1.z.object({
    hardware_signature: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    quote: zod_1.z.string().optional(),
});
exports.AttestationCreateRequestSchema = zod_1.z.object({
    project_id: zod_1.z.string(),
    repository_id: zod_1.z.string(),
    security_score: zod_1.z.number(),
});
exports.GitHubAuthRequestSchema = zod_1.z.object({
    access_token: zod_1.z.string(),
});
exports.ProjectCreateSchema = zod_1.z.object({
    github_repo: zod_1.z.string(),
});
exports.WebhookAuthorSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string(),
});
exports.WebhookCommitSchema = zod_1.z.object({
    id: zod_1.z.string(),
    message: zod_1.z.string(),
    timestamp: zod_1.z.string(),
    url: zod_1.z.string(),
    author: exports.WebhookAuthorSchema,
});
exports.WebhookRepositorySchema = zod_1.z.object({
    id: zod_1.z.number(),
    name: zod_1.z.string(),
    full_name: zod_1.z.string(),
    html_url: zod_1.z.string(),
});
exports.GithubWebhookPayloadSchema = zod_1.z.object({
    ref: zod_1.z.string(),
    repository: exports.WebhookRepositorySchema,
    commits: zod_1.z.array(exports.WebhookCommitSchema),
    head_commit: exports.WebhookCommitSchema.optional().nullable(),
});
