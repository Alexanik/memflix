const { FastMediaClient } = require('electron-fast-media-client')
const NetflixPlayer = require('./src/netflix-player')

let netflixMediaClient = new FastMediaClient(
    'https://netflix.com/login',
    'video',
    {
        width: 1090,
        height: 750,
        player: NetflixPlayer
    }
)