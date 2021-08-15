exports.default = function(context) {
    const { execSync } = require('child_process')

    console.log('Castlabs-evs update start')
    execSync('python3 -m pip install --upgrade castlabs-evs')
    console.log('Castlabs-evs update complete')

    if (process.platform !== 'darwin')
        return

    console.log('VMP signing start')
    execSync('python3 -m castlabs_evs.vmp sign-pkg ' + context.appOutDir)
    console.log('VMP signing complete')
}