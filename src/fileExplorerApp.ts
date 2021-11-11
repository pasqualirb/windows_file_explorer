import { ipcMain } from "electron";
import { BrowserWindow } from "electron-acrylic-window";
import { readdir } from "original-fs";
import * as path from "path";
import { Channels } from "./common";
import { On } from "./main";

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
		//this.mainWindow.webContents.openDevTools();

		// register mainWindow action handler
		On(Channels.MainWindow, (event: string) => {
			switch (event) {
				case "close":       this.mainWindow.close();      break;
				case "maximize":    this.mainWindow.maximize();   break;
				case "unmaximize":  this.mainWindow.unmaximize(); break;
				case "minimize":    this.mainWindow.minimize();   break;
			}
		});

		// window is initially unmaximized
		//ipcMain.emit("unmaximized");

		// register mainWindow events
		this.mainWindow.on("minimize",   () => ipcMain.emit("minimized"));
		this.mainWindow.on("maximize",   () => ipcMain.emit("maximized"));
		this.mainWindow.on("unmaximize", () => ipcMain.emit("unmaximized"));
		this.mainWindow.on("closed", () => { ipcMain.emit("closed"); this.mainWindow = null; });
	}

	constructor() {
		// refresh files
		ipcMain.on("refresh", (event, arg) => {
			return readdir(arg, (err, files) => event.reply("refreshed", files));
		});
	}
}
