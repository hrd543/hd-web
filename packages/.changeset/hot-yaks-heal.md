---
'@hd-web/dev-server': patch
'@hd-web/build': patch
---

Fix the dev server to allow routes like "about.html" as well as "about/index.html"

Remove the need for an html template from build.
Now, you can specify the head within the page function, as well as a title and description.
Remove the need for content404 an instead just use a sub route for this.
If a page doesn't have any sub routes, don't create a folder for this page, just create a `name.html` file.
