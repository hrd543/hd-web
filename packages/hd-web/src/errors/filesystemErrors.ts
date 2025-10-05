export const filsystemErrors = {
  'fs.noStaticFolder': (folder: string) =>
    `Couldn't find static folder "${folder}"`,
  'fs.missingConfig': () => "Couldn't find an hd.config.js file",
  'fs.fileType': (message: string) =>
    `Esbuild failed with the following error.\nDo you need to add a plugin to handle a file type?\n\n${message}`
}
