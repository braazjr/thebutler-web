import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class ElectronService {

  ipcRenderer: IpcRenderer | undefined

  constructor() {
    if (window.require) {
      try {
        this.ipcRenderer = window.require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('Electron\'s IPC was not loaded');
    }
  }

  sendIpc(channel, value) {
    if (!this.ipcRenderer) {
      return;
    }

    this.ipcRenderer.send(channel, value)
  }
}
