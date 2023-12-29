import { NS as INs, Server as INsServer, Player as INsPlayer } from '@ns';

export enum AdminStatus {
  BACKDOOR = 'BACKDOOR',
  ROOT = 'ROOT',
  HACKABLE = 'HACKABLE',
  LOCKED = 'LOCKED',
}

export class Server {
  public readonly name: string;
  public readonly hackingLevel: number;
  public readonly totalPortCount: number;
  public readonly maxRam: number;
  public readonly minSecurity: number;
  public readonly maxMoney: number;
  public readonly growthFactor: number;

  private _openPortCount: number = Infinity;
  private _currentSecurity: number = Infinity;
  private _currentMoney: number = 0;
  private _hackDuration: number = Infinity;
  private _hackChance: number = 0;
  private _contractCount: number = 0;
  private _adminStatus: AdminStatus = AdminStatus.LOCKED;

  private __hasRootAccess: boolean = false;

  private readonly ns: INs;

  constructor(ns: INs, name: string) {
    this.ns = ns;
    const serverData: INsServer = this.ns.getServer(name);

    this.name = name;
    this.hackingLevel = serverData.requiredHackingSkill ?? Infinity;
    this.totalPortCount = serverData.numOpenPortsRequired ?? Infinity;
    this.maxRam = serverData.maxRam ?? 0;
    this.minSecurity = serverData.minDifficulty ?? Infinity;
    this.maxMoney = serverData.moneyMax ?? 0;
    this.growthFactor = serverData.serverGrowth ?? 0;
  }

  get openPortCount(): number {
    this._openPortCount = this.ns.getServer(this.name).openPortCount ?? Infinity;
    return this._openPortCount;
  }

  get currentSecurty(): number {
    this._currentSecurity = this.ns.getServer(this.name).hackDifficulty || Infinity;
    return this._currentSecurity;
  }

  get currentMoney(): number {
    this._currentMoney = this.ns.getServer(this.name).moneyAvailable || 0;
    return this._currentMoney;
  }

  get hackDuration(): number {
    this._hackDuration = this.ns.getHackTime(this.name);
    return this._hackDuration;
  }

  get hackChance(): number {
    this._hackChance = this.ns.hackAnalyzeChance(this.name);
    return this._hackChance;
  }

  get contractCount(): number {
    this._contractCount = this.ns.ls(this.name, '.cct').length;
    return this._contractCount;
  }

  private getHasRootAccess(): boolean {
    this.__hasRootAccess = this.ns.getServer(this.name).hasAdminRights;
    return this.__hasRootAccess;
  }

  get adminStatus(): AdminStatus {

    this._adminStatus = AdminStatus.LOCKED;

    if (this.ns.getHackingLevel() >= this.hackingLevel)
      this._adminStatus = AdminStatus.HACKABLE;

    if (this.getHasRootAccess())
      this._adminStatus = AdminStatus.ROOT;

    if (this.ns.getServer(this.name).backdoorInstalled || this.name === 'home')
      this._adminStatus = AdminStatus.BACKDOOR;

    return this._adminStatus;
  }
}
