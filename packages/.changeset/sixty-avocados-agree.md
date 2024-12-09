---
'@hd-web/dev-server': patch
'@hd-web/create': patch
'@hd-web/build': patch
---

- Copy over images in src into the build folder and link them correctly
- Add support for a static folder for things like the favicon
- Fix the types for the dev server to allow any type of file data for the filesystem
- Update the create package to use these changes
