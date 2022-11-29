const { app, BrowserWindow } = require('electron');
const path = require('path');
const userAgent = require("./useragent")

async function createWindow() {
    let Useragent = await userAgent.getVersion()

    let mainWindow;

    mainWindow = new BrowserWindow({
        'width': 800,
        'height': 600,
        'webPreferences': {
            'contextIsolation': true,
            'plugins': true
        },
    })

    mainWindow.loadURL(`https://www.orion-black.es/`, { userAgent: Useragent })

    mainWindow.webContents.on('new-window', async function(e, url) {
        e.preventDefault()
        const external = new BrowserWindow({
            'webPreferences': {
                'contextIsolation': true,
                'plugins': true
            }
        })

        external.loadURL(url, { userAgent: Useragent })
    });
}

let ppapi_flash_path;

if (process.platform == 'win32') {
    ppapi_flash_path = path.join(__dirname, 'pepflashplayer.dll')
} else if (process.platform == 'linux') {
    ppapi_flash_path = `${__dirname}\libpepflashplayer.so`
} else if (process.platform == 'darwin') {
    ppapi_flash_path = `${__dirname}\PepperFlashPlayer.plugin`
}
/* to-do: MAC (iOS) support cooming soon... */ 

app.commandLine.appendSwitch('ppapi-flash-path', ppapi_flash_path);

app.whenReady().then(createWindow)

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})
