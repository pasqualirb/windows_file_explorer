
// Renderer api
export interface RendererPublicApi {
	on(channel: string, listener: (...args: any[]) => void): void;
	once(channel: string, listener: (...args: any[]) => void): void;
	send(channel: string, ...args: any): void;
}

export enum Channels {
	MainWindow = "mainWindow"
}
