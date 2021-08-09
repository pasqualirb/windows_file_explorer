import { BrowserWindow, ipcMain } from "electron";
import { readdir } from "original-fs";
import * as path from "path";

export class FileExplorerApp {
	private mainWindow: BrowserWindow;

	public createWindow() {
		if (this.mainWindow) {
			console.log("Warning: mainWindow already exists");
		}

		// Create the browser window.
		this.mainWindow = new BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				preload: path.join(__dirname, "preload.js"),
			},
			frame: false,
			minWidth: 450,
			//@ts-ignore
			vibrancy: {
				theme: "#ffffffaa",
				effect: "acrylic",
			},
			backgroundColor: "#ffffff"
		});

		// and load the index.html of the app.
		this.mainWindow.loadFile(path.join(__dirname, "../index.html"));

		// Open the DevTools.
		this.mainWindow.webContents.openDevTools();

		// register mainWindow events
		ipcMain.on("minimize", (e) => { this.mainWindow.minimize(); e.reply("minimized") });
		ipcMain.on("maximize", (e) => { this.mainWindow.maximize(); e.reply("maximized") });
		ipcMain.on("restore",  (e) => { this.mainWindow.restore();  e.reply("restored")  });
		ipcMain.on("close",    (e) => { this.mainWindow.close();    e.reply("closed")    });

		this.mainWindow.on("closed", () => { this.mainWindow = null; });
	}

	constructor() {
		// refresh files
		ipcMain.on("refresh", (event, arg) => {
			return readdir(arg, (err, files) => event.reply("refreshed", files));
		});
	}
}
