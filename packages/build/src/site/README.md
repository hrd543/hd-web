Example structure. In this example, cwd would be Documents/code/hd-web
src
about
index.tsx
contact
index.tsx
utils
add.ts
subtract.ts
index.html
index.tsx
index.css
tsconfig.json
build.ts <= This is where the command is likely to be run from

I run the build function with entryDir = "src" and outDir = "build"

From this, I find that the folders with index files are
".", "about", "contact"
since this will be relative to entryDir = "src"

I would then create a file with the following contents at "src":
import {default as a0} from "./index.tsx";
import {default as a1} from "./about/index.tsx";
import {default as a2} from "./contact/index.tsx";
const pages = [a0, a1, a2];
export default pages;

Now I create a js file at build/main.js which includes that pages export.
I import the main.js file and run all the functions in the pages array.
This gives me an array of html bodies, which follow the same order as the pages array.

I add all of the custom element definitions to the main.js file (inside build/)

I remove the unused code from the main.js file

I create index.html files in each of the directories in the pages array.
