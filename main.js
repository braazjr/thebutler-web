const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const url = require('url');
const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec

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

    // mainWindow.webContents.openDevTools()
    mainWindow.maximize()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    Menu.setApplicationMenu(Menu.buildFromTemplate([]))
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    if (mainWindow === null) createWindow()
})

// ARQUIVO DE CONFIGURAÇÃO

const settings_file_path = './electron/settings.json'

if (!fs.existsSync(settings_file_path)) {
    let settings = {
        bsPrintPath: '',
        projectPath: ''
    }

    fs.writeFileSync(settings_file_path, JSON.stringify(settings, null, 4))
}

const rawData = fs.readFileSync(settings_file_path)
const settings = JSON.parse(rawData || '{}')

ipcMain.on('configurations-save', (event, args) => {
    fs.writeFile(settings_file_path, JSON.stringify(args, null, 4), {}, (error) => {
        event.reply('configurations-save-replay', error || undefined)
    })
})

ipcMain.on('get-configurations', (event, args) => {
    event.reply('get-configurations-replay', settings)
})

// IMPRESSÃO DE CRACHÁS

ipcMain.on('imprimir-crachas', (event, args) => {
    let stream = fs.createWriteStream('test.txt')
    stream.once('open', fd => {
        args.forEach(line => stream.write(`${line}\n`))
        stream.end()
    })

    exec(`${settings.bsPrintPath} imprimir /p:${settings.projectPath}`, (error, stdout, stderr) => {
        event.reply('imprimir-crachas-replay', error || undefined)
    })
})