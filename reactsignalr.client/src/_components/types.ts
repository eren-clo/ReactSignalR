export interface CommandAction {
  name: string;
  data: string[];
}

export interface Device {
  fullName: string;
  deviceType: string;
  connectionId: string;
  availableCommands: CommandAction[];
}

export interface TravellerInfo {
  connectionId: string;
  connectionKey: string;
  nfcResult: string;
}
