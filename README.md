[![Build Status](https://travis-ci.com/Alexanik/memflix.svg?branch=main)](https://travis-ci.com/Alexanik/memflix)

# MEMFLIX

Memflix electron browser with MacBooks's Touchbar and global shortcuts support (media buttons on your keyboard, taps on your AirPods and etc) for Netflix website

Memflix based on [electron-fast-media-client module](https://github.com/Alexanik/electron-fast-media-client)

Although it was developed for macOS, you can use it on Windows and Linux too

# Install
Just visit [releases page](https://github.com/Alexanik/memflix/releases) where you can find some build for MacOS and Windows

# Build
1. Clone this repo
```
git clone git@github.com:alexanik/memflix.git
cd memflix
```

2. Install dependencies
```
npm install
```

3. Prepare castlabs-evs for application package signing

    Visit [wiki page](https://github.com/castlabs/electron-releases/wiki/EVS) where you can find castlabs-evs setup and usage guide

4. Build
```
npm run build
```

NOTE: On macOS for global shortcuts binding you must grant access to Memflix in System Preferences -> Security -> Accessibility
