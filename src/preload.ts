// All of the Node.js APIs are available in the preload process.

import { contextBridge, ipcRenderer } from "electron";
import { Events, RendererPublicApi } from "./common";

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) {
      element.innerText = text;
    }
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type as keyof NodeJS.ProcessVersions]);
  }
});

const api: RendererPublicApi = {
  send: (channel: string, data: any) => {
    Events.some(e => e.request === channel) && ipcRenderer.send(channel, data);
  },
  on: (channel: string, callback: (data: any) => void): void => {
    Events.some(e => e.event === channel) && ipcRenderer.on(channel, (e, data) => callback(data));
  }
};

contextBridge.exposeInMainWorld("api", api);
