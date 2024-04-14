const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const isDev = argv.dev

console.log('isDev', isDev)
// TODO: parse dev=true  option -> if true -> copy file electron-main-dev ; create the file by extr electron-main-common ->

const copyFile = (source, dest) => {
  // File destination will be created or overwritten by default.
  return fs.copyFile(source, dest, (err) => {
    if (err) throw err;
    console.log(`${source} copied to ${dest}`);
  });
}

// NOTE: issues with paths ....
// copyFile(isDev ? 'electron-main-dev.js' : 'electron-main-prod.js', 'platforms/electron/platform_www/cdv-electron-main.js')
// copyFile('electron-main.js', 'platforms/electron/platform_www/cdv-electron-main.js')
// prod only:
if (!fs.existsSync('./build')) {
  fs.mkdirSync('./build');
}
copyFile('electron-preload.js', 'build/electron-preload.js')
