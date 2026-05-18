import { IBpjsService } from '../../domain/interfaces/IBpjsService';

export class MockBpjsService implements IBpjsService {
  async verifyParticipant(bpjsNumber: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          metaData: { code: "200", message: "OK" },
          response: {
            peserta: {
              noKartu: bpjsNumber,
              nama: "John Doe",
              statusPeserta: {
                kode: "0",
                keterangan: "AKTIF"
              }
            }
          }
        });
      }, 800);
    });
  }

  async generateSEP(encounterId: string): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
        const sepNumber = `0015B011226V${randomStr}`;
        resolve(sepNumber);
      }, 800);
    });
  }
}
