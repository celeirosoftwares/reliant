import { ICredentialType, INodeProperties } from 'n8n-workflow'

export class ReliantApi implements ICredentialType {
  name = 'reliantApi'
  displayName = 'Reliant API'
  documentationUrl = 'https://reliant.dev.br/docs'
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your Reliant API Key. Find it in Dashboard → Settings.',
    },
    {
      displayName: 'User ID',
      name: 'userId',
      type: 'string',
      default: '',
      required: true,
      description: 'Your Reliant User ID. Find it in Dashboard → Settings.',
    },
    {
      displayName: 'API URL',
      name: 'apiUrl',
      type: 'string',
      default: 'https://reliant-production.up.railway.app',
      required: true,
    },
  ]
}
