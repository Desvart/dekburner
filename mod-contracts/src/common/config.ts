export class Config {

  static readonly CONTRACT_PUBLICATION_PORT: number = 2;
  static readonly WAIT_TIME_BETWEEN_SCRAPPING: number = 5 * 60 * 1000; // 5 minutes
  static readonly PUBLICATION_BATCH_SIZE: number = 5;
  static readonly WAIT_TIME_TO_NEXT_PUBLICATION: number = 5 * 1000; // 5 seconds

  static readonly DEBUG_MODE: boolean = true;

}

export class Constants {

  static readonly MODULE_NAME: string = 'MOD-CONTRACTS -';
  static readonly HOME_HOSTNAME: string = 'home';
  static readonly CONTRACT_FILE_EXTENSION: string = '.cct';

}

