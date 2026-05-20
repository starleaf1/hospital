import { IBpjsService } from '../../domain/interfaces/IBpjsService';
import { ISatusehatService } from '../../domain/interfaces/ISatusehatService';
import { IBillingService } from '../../domain/interfaces/IBillingService';
import { MockBpjsService } from '../bpjs/MockBpjsService';
import { SatusehatSandboxService } from '../satusehat/SatusehatSandboxService';
import { BillingService } from '../../domain/services/BillingService';
import { env } from './env';

export interface IServices {
  bpjsService: IBpjsService;
  satusehatService: ISatusehatService;
  billingService: IBillingService;
}

const createServices = (): IServices => {
  const bpjsService = env.BPJS_ENV === 'MOCK' 
    ? new MockBpjsService() 
    : new MockBpjsService(); // Fallback to mock for now

  const satusehatService = env.SATUSEHAT_ENV === 'SANDBOX'
    ? new SatusehatSandboxService()
    : new SatusehatSandboxService(); // Fallback to sandbox for now

  const billingService = new BillingService();

  return {
    bpjsService,
    satusehatService,
    billingService
  };
};

export const services = createServices();

