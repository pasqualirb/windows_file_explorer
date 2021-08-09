
export interface IpcEvent {
	event: string;
	request?: string;
}

export const Events: Array<IpcEvent> = [
	{ event: "refreshed", request: "refresh" },

	{ event: "maximized", request: "maximize" },
	{ event: "minimized", request: "minimize" },
	{ event: "closed",    request: "close" },
	// ...
];

// Renderer api
export interface RendererPublicApi {
	send(event: string, data: any): void;
	on(event: string, callback: (data: any) => any): void;
}
