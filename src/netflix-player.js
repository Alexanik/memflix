const { Player } = require('electron-fast-media-client')

class NetflixPlayer extends Player {
    constructor(window, ipcMain) {
        super(window, ipcMain)
    }

    seek(newTime) {
        let newTimeForNetflixPlayer = newTime * 1000

        this.window.webContents.executeJavaScript(`
            netflixVideoPlayer = netflix.appContext.state.playerApp.getAPI().videoPlayer
            player = netflixVideoPlayer.getVideoPlayerBySessionId(netflixVideoPlayer.getAllPlayerSessionIds()[0])
            player.seek(${newTimeForNetflixPlayer})
        `)
    }

    isFoundedVideoOk() {
        let url = this.window.webContents.getURL()

        if (url.startsWith('https://www.netflix.com/watch/') || url.startsWith('https://netflix.com/watch/'))
            return true

        return false
    }
}

module.exports = NetflixPlayer