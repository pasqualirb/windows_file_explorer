// All of the Node.js APIs are available in the preload process.

import { contextBridge, ipcRenderer } from "electron";
import { RendererPublicApi } from "./common";

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
  // For channels
  on:   (channel: string, listener: (...args: any[]) => void)   =>  ipcRenderer.on(channel, listener),
  once: (channel: string, listener: (...args: any[]) => void)   =>  ipcRenderer.once(channel, listener),
  send: (channel: string, ...args: any[])                       =>  ipcRenderer.send(channel, args),
};

contextBridge.exposeInMainWorld("api", api);
