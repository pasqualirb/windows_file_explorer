import { app, BrowserWindow, ipcMain } from "electron";
import { FileExplorerApp } from "./fileExplorerApp";

const mainInstance: FileExplorerApp = new FileExplorerApp();

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
  mainInstance.createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0)
      mainInstance.createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

type Listener = (...args: any[]) => void;

export const On = (channel: string, listener: Listener) => ipcMain.on(channel, (event, ...args: any[]) => listener(args));
