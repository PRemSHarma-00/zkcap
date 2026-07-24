import { z } from 'zod';

export const VulnerabilitySchema = z.object({
  type: z.string(),
  severity: z.string(), // "critical", "high", "medium", "low"
  description: z.string(),
});

export const TEEEvaluationSchema = z.object({
  security_score: z.number().min(0).max(100),
  pass_evaluation: z.boolean(),
  vulnerabilities: z.array(VulnerabilitySchema).default([]),
  reasoning: z.string(),
});

export const TEEExecutionSchema = z.object({
  hardware_signature: z.string(),
  timestamp: z.string(),
  quote: z.string().optional(),
});

export const AttestationCreateRequestSchema = z.object({
  project_id: z.string(),
  repository_id: z.string(),
  security_score: z.number(),
});

export const GitHubAuthRequestSchema = z.object({
  access_token: z.string(),
});

export const ProjectCreateSchema = z.object({
  github_repo: z.string(),
});

export const WebhookAuthorSchema = z.object({
  name: z.string(),
  email: z.string(),
});

export const WebhookCommitSchema = z.object({
  id: z.string(),
  message: z.string(),
  timestamp: z.string(),
  url: z.string(),
  author: WebhookAuthorSchema,
});

export const WebhookRepositorySchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string(),
});

export const GithubWebhookPayloadSchema = z.object({
  ref: z.string(),
  repository: WebhookRepositorySchema,
  commits: z.array(WebhookCommitSchema),
  head_commit: WebhookCommitSchema.optional().nullable(),
});
