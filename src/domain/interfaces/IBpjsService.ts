export interface IBpjsService {
  verifyParticipant(bpjsNumber: string): Promise<any>;
  generateSEP(encounterId: string): Promise<string>;
}
