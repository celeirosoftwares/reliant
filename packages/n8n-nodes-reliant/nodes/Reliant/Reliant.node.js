"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reliant = void 0;
const n8n_workflow_1 = require("n8n-workflow");

class Reliant {
  constructor() {
    this.description = {
      displayName: 'Reliant',
      name: 'reliant',
      group: ['transform'],
      version: 1,
      subtitle: '={{$parameter["operation"]}}',
      description: 'Guaranteed structured outputs from any LLM using Reliant',
      defaults: { name: 'Reliant' },
      inputs: ['main'],
      outputs: ['main'],
      credentials: [{ name: 'reliantApi', required: true }],
      properties: [
        {
          displayName: 'Operation',
          name: 'operation',
          type: 'options',
          noDataExpression: true,
          options: [
            { name: 'Execute', value: 'execute', description: 'Execute a prompt with schema validation and retry' },
            { name: 'List Schemas', value: 'listSchemas', description: 'List all schemas' },
            { name: 'Get Execution', value: 'getExecution', description: 'Get execution details by ID' },
            { name: 'Get Metrics', value: 'getMetrics', description: 'Get metrics summary' },
          ],
          default: 'execute',
        },
        {
          displayName: 'Prompt',
          name: 'prompt',
          type: 'string',
          typeOptions: { rows: 4 },
          default: '',
          required: true,
          displayOptions: { show: { operation: ['execute'] } },
          description: 'The prompt to send to the LLM',
        },
        {
          displayName: 'Schema ID',
          name: 'schemaId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['execute'] } },
          description: 'Schema ID from Reliant Dashboard → Schemas (click "Copy ID")',
        },
        {
          displayName: 'Provider',
          name: 'provider',
          type: 'options',
          options: [
            { name: 'Anthropic', value: 'anthropic' },
            { name: 'OpenAI', value: 'openai' },
            { name: 'Google Gemini', value: 'gemini' },
            { name: 'Groq', value: 'groq' },
            { name: 'Mistral', value: 'mistral' },
          ],
          default: 'anthropic',
          required: true,
          displayOptions: { show: { operation: ['execute'] } },
        },
        {
          displayName: 'Model',
          name: 'model',
          type: 'string',
          default: 'claude-sonnet-4-20250514',
          required: true,
          displayOptions: { show: { operation: ['execute'] } },
          description: 'Model name. Ex: claude-sonnet-4-20250514, gpt-4o, gemini-1.5-pro',
        },
        {
          displayName: 'Max Retries',
          name: 'maxRetries',
          type: 'number',
          default: 3,
          displayOptions: { show: { operation: ['execute'] } },
          description: 'Maximum number of retry attempts (default: 3)',
        },
        {
          displayName: 'Execution ID',
          name: 'executionId',
          type: 'string',
          default: '',
          required: true,
          displayOptions: { show: { operation: ['getExecution'] } },
        },
        {
          displayName: 'Period (days)',
          name: 'days',
          type: 'number',
          default: 30,
          displayOptions: { show: { operation: ['getMetrics'] } },
        },
      ],
    };
  }

  async execute() {
    const items = this.getInputData();
    const credentials = await this.getCredentials('reliantApi');
    const operation = this.getNodeParameter('operation', 0);

    const apiKey = credentials.apiKey;
    const userId = credentials.userId;
    const apiUrl = credentials.apiUrl || 'https://reliant-production.up.railway.app';

    const results = [];

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData;

        if (operation === 'execute') {
          const prompt = this.getNodeParameter('prompt', i);
          const schemaId = this.getNodeParameter('schemaId', i);
          const provider = this.getNodeParameter('provider', i);
          const model = this.getNodeParameter('model', i);
          const maxRetries = this.getNodeParameter('maxRetries', i);

          const response = await this.helpers.request({
            method: 'POST',
            url: `${apiUrl}/execute`,
            headers: {
              'Content-Type': 'application/json',
              'X-Reliant-Key': apiKey,
            },
            body: JSON.stringify({
              prompt,
              schema_id: schemaId,
              provider,
              model,
              user_id: userId,
              options: { max_retries: maxRetries },
            }),
          });
          responseData = JSON.parse(response);

        } else if (operation === 'listSchemas') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `${apiUrl}/schemas`,
            headers: { 'X-Reliant-Key': apiKey },
          });
          responseData = JSON.parse(response);

        } else if (operation === 'getExecution') {
          const executionId = this.getNodeParameter('executionId', i);
          const response = await this.helpers.request({
            method: 'GET',
            url: `${apiUrl}/executions/${executionId}`,
            headers: { 'X-Reliant-Key': apiKey },
          });
          responseData = JSON.parse(response);

        } else if (operation === 'getMetrics') {
          const days = this.getNodeParameter('days', i);
          const response = await this.helpers.request({
            method: 'GET',
            url: `${apiUrl}/metrics/summary?days=${days}`,
            headers: { 'X-Reliant-Key': apiKey },
          });
          responseData = JSON.parse(response);
        }

        results.push({ json: responseData });
      } catch (error) {
        if (this.continueOnFail()) {
          results.push({ json: { error: error.message } });
          continue;
        }
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error.message);
      }
    }

    return [results];
  }
}
exports.Reliant = Reliant;
