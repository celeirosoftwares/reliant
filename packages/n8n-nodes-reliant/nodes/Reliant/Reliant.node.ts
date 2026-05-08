import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow'

export class Reliant implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Reliant',
    name: 'reliant',
    icon: 'file:reliant.svg',
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
          { name: 'Execute', value: 'execute', description: 'Execute a prompt with schema validation' },
          { name: 'List Schemas', value: 'listSchemas', description: 'List all schemas' },
          { name: 'Get Execution', value: 'getExecution', description: 'Get execution details by ID' },
          { name: 'Get Metrics', value: 'getMetrics', description: 'Get metrics summary' },
        ],
        default: 'execute',
      },

      // Execute fields
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
        description: 'Schema ID from Reliant Dashboard → Schemas',
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
        description: 'Model name for the selected provider',
      },
      {
        displayName: 'Max Retries',
        name: 'maxRetries',
        type: 'number',
        default: 3,
        displayOptions: { show: { operation: ['execute'] } },
      },

      // Get Execution fields
      {
        displayName: 'Execution ID',
        name: 'executionId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['getExecution'] } },
      },

      // Metrics fields
      {
        displayName: 'Period (days)',
        name: 'days',
        type: 'number',
        default: 30,
        displayOptions: { show: { operation: ['getMetrics'] } },
      },
    ],
  }

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData()
    const credentials = await this.getCredentials('reliantApi')
    const operation = this.getNodeParameter('operation', 0) as string

    const apiKey = credentials.apiKey as string
    const userId = credentials.userId as string
    const apiUrl = (credentials.apiUrl as string) || 'https://reliant-production.up.railway.app'

    const results: INodeExecutionData[] = []

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: any

        if (operation === 'execute') {
          const prompt = this.getNodeParameter('prompt', i) as string
          const schemaId = this.getNodeParameter('schemaId', i) as string
          const provider = this.getNodeParameter('provider', i) as string
          const model = this.getNodeParameter('model', i) as string
          const maxRetries = this.getNodeParameter('maxRetries', i) as number

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
          })

          responseData = JSON.parse(response)

        } else if (operation === 'listSchemas') {
          const response = await this.helpers.request({
            method: 'GET',
            url: `${apiUrl}/schemas`,
            headers: { 'X-Reliant-Key': apiKey },
          })
          responseData = JSON.parse(response)

        } else if (operation === 'getExecution') {
          const executionId = this.getNodeParameter('executionId', i) as string
          const response = await this.helpers.request({
            method: 'GET',
            url: `${apiUrl}/executions/${executionId}`,
            headers: { 'X-Reliant-Key': apiKey },
          })
          responseData = JSON.parse(response)

        } else if (operation === 'getMetrics') {
          const days = this.getNodeParameter('days', i) as number
          const response = await this.helpers.request({
            method: 'GET',
            url: `${apiUrl}/metrics/summary?days=${days}`,
            headers: { 'X-Reliant-Key': apiKey },
          })
          responseData = JSON.parse(response)
        }

        results.push({ json: responseData })
      } catch (error: any) {
        if (this.continueOnFail()) {
          results.push({ json: { error: error.message } })
          continue
        }
        throw new NodeOperationError(this.getNode(), error.message)
      }
    }

    return [results]
  }
}
