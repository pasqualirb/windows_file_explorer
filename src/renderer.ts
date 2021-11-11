// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

// Setup renderer Inter-Process Communication (IPC)
// ================================================

import { Channels, RendererPublicApi } from "./common";

declare global {
	interface Window { api: RendererPublicApi; }
}

const Send = window.api.send;
const On   = window.api.on;

// Register listeners
// ==================

// "refresh" completion
On("refreshed", (files: string[]) => {
	document.getElementById("files-container").innerHTML = "";
	for (let fileName of files) {
		let element = document.createElement("div");
		element.classList.add("file-line");
		let newContent = document.createTextNode(fileName);
		element.appendChild(newContent);
		document.getElementById("files-container").appendChild(element);
	}
});

const MINIMIZE_BUTTON_ID = "minimize-button";
const MAXIMIZE_BUTTON_ID = "maximize-button";
const UNMAXIMIZE_BUTTON_ID = "unmaximize-button";
const CLOSE_BUTTON_ID = "close-button";

On(Channels.MainWindow, (event: string) => {
	switch (event) {
		case "maximized": {
			let elem = document.getElementById(MAXIMIZE_BUTTON_ID);
			if (!elem)
				return;
			elem.id = UNMAXIMIZE_BUTTON_ID;
			elem.onclick = unmaximizeWindow;
			break;
		}
		case "unmaximized": {
			let elem = document.getElementById(UNMAXIMIZE_BUTTON_ID);
			if (!elem)
				return;
			elem.id = MAXIMIZE_BUTTON_ID;
			elem.onclick = maximizeWindow;
			break;
		}
	}
});

// TODO: parse config file
//   - Define custom actions (like open Terminal here). Check if windows has an API for that.
//   - 
// TODO: parse state file (recent files / last directory / windows size / whether panes are visible)
//       Also, check if windows has an API for (e.g.) recent files
// TODO: option to hide file extensions?
// TODO: When an event is sent (e.g. open properties of a file), send together the current context/directory
//       for checking against the context when event is received. This prevents weird behaviors. Also, try
//       to cancel events and close windows/objects that belong to the previous context.
// TODO: Allow pluggable ops for filesystems. Or maybe not ... leave this for winfsp or dokan
// TODO: When a folder or file is selected, Ctrl+Shift+C copies its path

declare global {
	interface Window {
		minimizeWindow: () => void;
		maximizeWindow: () => void;
		unmaximizeWindow: () => void;
		closeWindow: () => void;
	}
}

const minimizeWindow    = () => Send(Channels.MainWindow, "minimize");
const maximizeWindow    = () => Send(Channels.MainWindow, "maximize");
const unmaximizeWindow  = () => Send(Channels.MainWindow, "unmaximize");
const closeWindow       = () => Send(Channels.MainWindow, "close");

window.minimizeWindow    = minimizeWindow;
window.maximizeWindow    = maximizeWindow;
window.unmaximizeWindow  = unmaximizeWindow;
window.closeWindow       = closeWindow;

// Entry point
// ===========

function init() {
	let path = "/";

	// load files
	Send("refresh", path);
}

init();
