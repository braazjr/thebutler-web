const { app, BrowserWindow, ipcMain } = require('electron')
const url = require('url');
const path = require('path');
const fs = require('fs');

let mainWindow

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, `dist/assets/images/logo.png`)
    })

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/index.html`),
            protocol: 'file:',
            slashes: true
        })
    );

    mainWindow.webContents.openDevTools()
    mainWindow.maximize()

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

ipcMain.on('imprimir-crachas', (event, args) => {
    console.log(args)

    let stream = fs.createWriteStream('test.txt')
    stream.once('open', fd => {
        args.forEach(line => stream.write(`${line}\n`))
        stream.end()
    })

    event.reply('imprimir-crachas-replay')
})