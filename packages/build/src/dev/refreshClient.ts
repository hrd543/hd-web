/**
 * This code will be added as a separate script when running the dev server.
 * It is responsible for refreshing the page when the server restarts.
 */
export const getRefreshClientScript = (port: number) => {
  return `
    const ws = new WebSocket("ws:localhost:${port}");
    ws.addEventListener("message", () => window.location.reload());
  `
}
