---
'@hd-web/build-package': patch
'@hd-web/components': patch
'@hd-web/build': patch
'@hd-web/jsx': patch
---

- Add a new interact function to handle interactivity instead of web components.
- Rewrite all components (except toast which is deprecated) to use this.
- Provide some helper functions to aid in adding this interactivity.
- Fix a bug in the build-package script.
- Make buildSite and startDev build for node on their first pass to have access to fs/path etc.
- Make build a peer dependency of components
- Fix jsx types to allow css variables in style
