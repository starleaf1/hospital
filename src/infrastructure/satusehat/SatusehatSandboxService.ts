import axios from 'axios';
import { ISatusehatService } from '../../domain/interfaces/ISatusehatService';
import { env } from '../config/env';

export class SatusehatSandboxService implements ISatusehatService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  async authenticate(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    const authUrl = 'https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials';
    const payload = new URLSearchParams({
      client_id: env.SATUSEHAT_CLIENT_ID,
      client_secret: env.SATUSEHAT_CLIENT_SECRET,
    });

    try {
      const response = await axios.post(authUrl, payload.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      this.accessToken = response.data.access_token;
      // Expires in seconds, so we convert to ms, subtract a buffer of 60s
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;
      
      return this.accessToken as string;
    } catch (error) {
      console.error('SATUSEHAT Auth Error:', error);
      throw new Error('Failed to authenticate with SATUSEHAT');
    }
  }

  async createEncounter(encounterData: any): Promise<string> {
    const token = await this.authenticate();
    // In a real scenario, this would post the FHIR encounter resource to SATUSEHAT
    // For this boilerplate, we simulate the resource creation
    const fhirUrl = 'https://api-satusehat-stg.dto.kemkes.go.id/fhir-r4/v1/Encounter';
    
    // Simulate API call for the assignment purposes
    return `satusehat-enc-${Math.random().toString(36).substring(2, 10)}`;
  }
}
