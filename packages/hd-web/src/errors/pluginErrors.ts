export const pluginErrors = {
  'plugin.error': (name: string, method: string, error: unknown) =>
    `Plugin "${name}" failed at ${method} with the following error:\n\n${error}`
}
