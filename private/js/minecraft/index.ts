export = {
  getServers: (user: string, callback: (servers: string[]) => void) => {},
  serverAccess: (user: string, server: string, callback: (ok: boolean) => void) => {},
  getLog: (server: string, callback: (log: string) => void) => {},
  addRes: (server: string, res) => {},
  command: (server: string, command: string, callback: (response: string) => void) => {}
};