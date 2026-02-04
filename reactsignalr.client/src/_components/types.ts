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
