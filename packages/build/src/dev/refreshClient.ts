/**
 * This code will be added as a separate script when running the dev server.
 * It is responsible for refreshing the page when the server restarts.
 */
export const getRefreshClientScript = (port: number) => {
  // Currently this code is run on the node server as well since it's added before
  // import, and is thus run as a side effect.
  // Should move to a separate script, or add it after import.
  // Once done, can remove the typeof check
  return `
    if (typeof window !== "undefined") {
      const ws = new WebSocket("ws://localhost:${port}");
      ws.addEventListener("open", () => {
        console.log("initialising");
      })
      ws.addEventListener("message", () => {
        console.log("hello");
        window.location.reload()
      });
    }
  `
}
