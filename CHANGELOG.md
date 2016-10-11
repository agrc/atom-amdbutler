## 1.0.2
* Fix bug causing issues at Atom 1.11.

## 1.0.0
* Add missing commands to package menu.
* Remove npm shrinkwrap.
* Switch from JSCS/JSHint to ESLint.
* More graceful handling of error when a base folder is not found in the patch of the current file ([#10](https://github.com/agrc/atom-amdbutler/issues/10))
* Handle empty files better ([#11](https://github.com/agrc/atom-amdbutler/issues/11))
* Fix bug causing params with special characters to be removed ([#21](https://github.com/agrc/atom-amdbutler/issues/21)). Thanks to @mokkabonna for reporting this.
* Bump to a reasonable version number.

## 0.3.0
* Automatically selects the word that is under the cursor if any. Another super-useful enhancement from @mokkabonna. Thanks!

## 0.2.0
* :racehorse: Make module list a global and share between buffers
* Watch file system for changes and update modules list on changes ([#9](https://github.com/agrc/atom-amdbutler/issues/9))
* Fix bug causing incorrect insertions when there is only one import and the import path and param name are the same ([#14](https://github.com/agrc/atom-amdbutler/issues/14))
* Add config option to control the separation of packages with a new line (thanks, @mokkabonna!)
* Read indent size from atom config (thanks, @mokkabonna!)

## 0.1.0
* add, remove & sort commands
