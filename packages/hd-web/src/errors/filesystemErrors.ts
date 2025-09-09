export const filsystemErrors = {
  'fs.noStaticFolder': (folder: string) =>
    `Couldn't find static folder "${folder}"`,
  'fs.missingConfig': () => "Couldn't find an hd.config.js file"
}
