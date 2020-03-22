# Developer Guide

## Building / NPM Scripts

Npm watches for any changes to ts/tsx files and rebuilds the client and server.

    sh build.sh

which runs

    sudo npm run build &
    sudo npm run pack &
    sudo npm run server

Navigating to *localhost* on a browser will display the game.

---