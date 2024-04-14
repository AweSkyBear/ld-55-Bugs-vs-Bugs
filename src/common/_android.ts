import { debugLog, setGlobalVar } from "./debug";
import { Func } from "./types";

declare const window: Window & {
  requestFileSystem: any;
  resolveLocalFileSystemURL: any;
};
declare const LocalFileSystem: any;
declare const cordova: any;

export const getAppDataDirectory = () => {
  return cordova.file.dataDirectory;
};
setGlobalVar(getAppDataDirectory);

export const getCordovaDistDirectoryPath = () =>
  cordova.file.applicationDirectory + "/www/dist";
setGlobalVar(getCordovaDistDirectoryPath);

export const getCordovaDistDirectoryFiles = () =>
  listDir(cordova.file.applicationDirectory + "/www/dist");

export const getAppDataDirectoryEntry = () => {
  return window.resolveLocalFileSystemURL(getAppDataDirectory());
};
setGlobalVar(getAppDataDirectoryEntry);

export const getCordovaFilePlugin = () => cordova.file;
setGlobalVar(getCordovaFilePlugin);

export const listDir = (path: string) => {
  window.resolveLocalFileSystemURL(
    path,
    function (fileSystem) {
      var reader = fileSystem.createReader();
      reader.readEntries(
        function (entries) {
          debugLog(entries);
        },
        function (err) {
          debugLog(err);
        }
      );
    },
    function (err) {
      debugLog(err);
    }
  );
};
setGlobalVar(listDir);

export type FileEntry = object;

const _readWWWDistFile = (path: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // ANDROID-SPECIFIC only:
    if (!cordova.file) {
      // FOR WINDOWS/comp:
      // debugWarn('Cannot readWWWDistFileAsB64 since not on Cordova')

      // @ts-ignore
      // return import(
      //   /* webpackChunkName: "[request]" */ "../../assets/textures/" + path
      // ).then((module) => resolve(module.default));
    }
    window.resolveLocalFileSystemURL(
      cordova.file.applicationDirectory + "/www/dist/" + path,
      (fe) => resolve(fe),
      reject
    );
  });
};

export const readWWWDistFileAsB64 = (path: string): Promise<string> => {
  // return new Promise(resolve => _readWWWDistFile(path).then((fe) => readFileAsB64(fe)).then(resolve)) // FAIL
  return new Promise((resolve, reject) => {
    if (!cordova.file) {
      // FOR WINDOWS/comp:
      // debugWarn('Cannot readWWWDistFileAsB64 since not on Cordova')
      // @ts-ignore
      // return import(
      //   /* webpackChunkName: "[request]" */ "../../assets/textures/" + path
      // ).then((module) => resolve(module.default));
    }

    // ANDROID-SPECIFIC only:
    debugLog('TRYING TO LOAD ', path)
    window.resolveLocalFileSystemURL(
      // @ts-ignore
      // cordova.file.applicationDirectory + "/www/assets/textures/" + path,
      (fe) => {
        debugLog('FILE ENTRY THAT WILL LOAD: ', fe)
        return readFileAsB64(fe)
          .then(resolve as any)
          .catch((err) => { debugLog('ERR: ', err); reject(err) })
      },
      reject
    );
  });
};
setGlobalVar(readWWWDistFileAsB64);

export const readWWWDistFileAsBlob = (path: string): Promise<string> => {
  // return new Promise(resolve => _readWWWDistFile(path).then((fe) => readFileAsB64(fe)).then(resolve)) // FAIL
  return new Promise((resolve, reject) => {
    if (!cordova.file) {
      // FOR WINDOWS/comp:
      // debugWarn('Cannot readWWWDistFileAsB64 since not on Cordova')
      
      // return import(
      //   /* webpackChunkName: "request" */ "../../assets/textures/" + path
      // ).then((module) => resolve(module.default));
    }
    
    // ANDROID-SPECIFIC only:
    debugLog('TRYING TO LOAD ', path)
    // window.resolveLocalFileSystemURL(
    //   cordova.file.applicationDirectory + "/www/assets/textures/" + path,
    //   (fe) => {
    //     debugLog('FILE ENTRY THAT WILL LOAD: ', fe)
    //     return readFileAsArrayBuffer(fe)
    //       .then(resolve as any)
    //       .catch((err) => { debugLog('ERR: ', err); reject(err) })
    //   },
    //   reject
    // );
    
    // window.resolveLocalFileSystemURL(
    //   cordova.file.applicationDirectory + "/www/assets/textures/" + path,
    //   (fe) => {
    //     debugLog('FILE ENTRY () THAT WILL LOAD: ', fe)
    //     readFileAsArrayBuffer(fe)
    //       .then((buffer) => new Blob([buffer]))
    //       // .then(
    //       //   (arrayBuffer) =>
    //       //     new Blob([new Uint8Array(arrayBuffer as any, byteOffset, length)])
    //       // )
    //       .catch((err) => { debugLog('ERR: ', err); reject(err) })
    //   }, 
    //   (err) => { debugLog('ERR: ', err); reject(err) }
    // );
  });
};

let _readFile = (
  fileEntry,
  getReadFn: (fe: FileReader) => Func<FileEntry, void>
) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = ({ target: { result } }) => {
        debugLog(`LOADED FILE: `, result);

        resolve(result);
      };

      getReadFn(reader)(file)
      // reader.readAsArrayBuffer(file);
    }, reject);
  });
};
/** Return a b64 string from the FileEntry */
export const readFileAsB64 = (
  fileEntry
) => {
  return new Promise<string | ArrayBuffer>((resolve, reject) => {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = ({ target: { result } }) => {
        debugLog(`LOADED FILE: `, result);

        resolve(result);
      };

      reader.readAsDataURL(file);
    }, reject);
  });
};

export const readFileAsBinaryString = (fileEntry) =>
  _readFile(fileEntry, (reader) => reader.readAsBinaryString);
export const readFileAsArrayBuffer = (fileEntry) =>
  // _readFile(fileEntry, (reader) => reader.readAsArrayBuffer);
  new Promise<string | ArrayBuffer>((resolve, reject) => {
    fileEntry.file(function (file) {
      var reader = new FileReader();
      reader.onloadend = ({ target: { result } }) => {
        debugLog(`LOADED FILE: `, result);

        resolve(result);
      };

      reader.readAsArrayBuffer(file);
      // reader.readAsArrayBuffer(file);
    }, reject);
  });

setGlobalVar(readFileAsB64);
setGlobalVar(readFileAsArrayBuffer);
//example: list of www/audio/ folder in cordova/ionic app.

/// SUCCEEDS:
/*
    listDir(cordova.file.applicationDirectory + '/www/dist')

    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + '/www/dist/nebulae_1-avif.js', debugLog, console.error)



*/

// listDir(cordova.file.applicationDirectory + "www/audio/");
// const readFile = (
//     fName: string = 'newPersistentFile.txt',
//     data: any = null,
//     success: any,
//     fail: any
//   ) => {
//     window.requestFileSystem(
//       LocalFileSystem.PERSISTENT,
//       0,
//       (fs) => {
//         debugLog('file system open: ' + fs.name)
//         fs.root.getFile(
//           fName,
//           { create: true, exclusive: false },
//           (fileEntry) => {
//             debugLog('fileEntry is file?' + fileEntry.isFile.toString())
//             // fileEntry.name == 'someFile.txt'
//             // fileEntry.fullPath == '/someFile.txt'
//             writeFile(
//               fileEntry,
//               data,
//               () => callAll(console.info, success, shareFile)(fileEntry),
//               fail
//             )
//           },
//           callAll(fail, debugWarn)
//         )
//       },
//       callAll(fail, debugWarn)
//     )
//   }
