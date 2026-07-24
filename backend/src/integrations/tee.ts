import { settings } from '../core/config';

export class TEEWorkerClient {
  private endpointUrl: string;
  private callbackBaseUrl: string;
  private timeout: number;

  constructor(endpointUrl: string, callbackBaseUrl: string, timeout: number = 60000) {
    this.endpointUrl = endpointUrl;
    this.callbackBaseUrl = callbackBaseUrl;
    this.timeout = timeout;
  }

  async invokeEvaluation(
    commitId: string,
    commitHash: string,
    commitDiff: string,
    commitAuthor: string,
    repositoryUrl: string
  ): Promise<string> {
    if (!this.endpointUrl || this.endpointUrl === 'http://localhost:9090/invoke') {
      throw new Error('TEE worker endpoint not configured. Set PHALA_TEE_ENDPOINT env var.');
    }

    const callbackUrl = `${this.callbackBaseUrl}/api/evaluation/callback`;

    const payload = {
      commit_id: commitId,
      commit_hash: commitHash,
      commit_diff: commitDiff,
      commit_author: commitAuthor,
      repository_url: repositoryUrl,
      callback_url: callbackUrl,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error(`TEE worker returned error: ${response.status} - ${text}`);
        throw new Error(`TEE worker returned error: ${response.status}`);
      }

      const result = await response.json();
      const invocationId = result.invocation_id || result.id;
      console.log(`TEE invocation initiated: ${invocationId} for commit ${commitHash}`);
      return invocationId;
    } catch (e: any) {
      console.error(`TEE worker request failed: ${e.message}`);
      throw e;
    }
  }
}

export const teeClient = new TEEWorkerClient(
  settings.phalaTeeEndpoint,
  settings.teeCallbackBaseUrl,
  settings.teeEvaluationTimeout * 1000
);
