const { ipcRenderer } = require('electron')
window.ipcRenderer = ipcRenderer
delete window.module

if (process.env.NODE_ENV === 'test') {
    window.electronRequire = require
}

function getVideo() {
    videos = document.getElementsByTagName("video")

    if (videos.length === 0)
        return null

    return videos[0]
}

function startLookingForVideo() {
    var checkVideoExists = setInterval(() => {
        var video = getVideo()

        if (video == null || !window.location.href.startsWith('https://www.netflix.com/watch/'))
            return

        let paused = video.paused
        let volume = video.volume
        let duration = video.duration
        let currentTime = video.currentTime

        video.ontimeupdate = (e) => {
            ipcRenderer.send('EVENT_VIDEO_TIME_UPDATE', video.currentTime, video.duration)
        }

        video.onvolumechange = (e) => {
            ipcRenderer.send('EVENT_VIDEO_VOLUME_CHANGE', video.volume)
        }

        video.onplay = (e) => {
            ipcRenderer.send('EVENT_VIDEO_PLAY')
        }

        video.onpause = (e) => {
            ipcRenderer.send('EVENT_VIDEO_PAUSE')
        }

        ipcRenderer.send('EVENT_VIDEO', paused, volume, duration, currentTime)

        clearInterval(checkVideoExists)

        startLookingForVideoHide()
    }, 250)
}

function startLookingForVideoHide() {
    var checkVideoHide = setInterval(() => {
        video = getVideo()

        if (video != null && window.location.href.startsWith('https://www.netflix.com/watch/'))
            return

        ipcRenderer.send('EVENT_VIDEO_HIDE', null)

        clearInterval(checkVideoHide)

        startLookingForVideo()
    }, 250)
}

ipcRenderer.on('EVENT_PLAY', () => {
    var video = getVideo()

    if (video == null)
        return

    if (video.paused)
        video.play()
    else
        video.pause()
})

window.onload = () => {
    startLookingForVideo()
}