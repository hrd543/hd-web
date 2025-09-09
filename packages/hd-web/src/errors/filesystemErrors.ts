export const filsystemErrors = {
  'fs.noStaticFolder': (folder: string) =>
    `Couldn't find static folder "${folder}"`,
  'fs.missingConfig': () => "Couldn't find an hd.config.js file",
  'fs.fileType': (message: string) =>
    `Esbuild failed with the following error.\nDid you include all the file types in the fileTypes config option?\n\n${message}`
}
