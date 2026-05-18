export interface ISatusehatService {
  authenticate(): Promise<string>;
  createEncounter(encounterData: any): Promise<string>;
}
