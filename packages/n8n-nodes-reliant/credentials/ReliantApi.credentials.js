"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReliantApi = void 0;

class ReliantApi {
  constructor() {
    this.name = 'reliantApi';
    this.displayName = 'Reliant API';
    this.documentationUrl = 'https://reliant.dev.br/docs';
    this.properties = [
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
        description: 'Reliant API base URL.',
      },
    ];
  }
}
exports.ReliantApi = ReliantApi;
