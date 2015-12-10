OSX | Windows
------------|------------
[![Build Status](http://img.shields.io/travis/agrc/atom-amdbutler/master.svg)](https://travis-ci.org/agrc/atom-amdbutler) | [![Build status](https://img.shields.io/appveyor/ci/stdavis/atom-amdbutler/master.svg)](https://ci.appveyor.com/project/stdavis/atom-amdbutler/branch/master)

# AMD Butler Package for Atom

>Serving up AMD module imports

An Atom package for managing AMD dependency import statements. It helps you quickly sort, add, and remove AMD import statements. With features such as auto sorting and auto module name discovery it allows you to focus more on your code rather than worrying your AMD imports. This is a port of a [plugin with the same name for Sublime Text 3](https://github.com/agrc/AmdButler).

## Commands
#### `amdbutler:sort` (alt-s)
Sorts the existing AMD imports for the current file alphabetically. Packages are separated by a blank line. The corresponding parameter names are also reordered.

#### `amdbutler:add` (alt-a)
Searches your packages for possible imports and displays them in a select list. When an import is selected it is added to the imports for the current file. The imports for the current file are then sorted.

*Note*: The file that you execute this command from must be a descendant from a folder with a name that matches one of the names in the `baseFolders` setting.

To prevent duplicate, imports that are already in the current file are excluded from the list.

Argument aliases are usually returned as the file name of the module (e.g. `dojo/_base/array` => `array`). However, if the file name is a [reserved word in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar) the package name is prepended to the beginning of the file name (e.g. `dojo/string` => `dojoString`). [Preferred argument aliases](lib/data/preferred-argument-aliases.js) are also taken into account if they do not follow the standard conventions (PR's for this file are welcome).

If there is a word under the cursor at the time that this command is invoked it is automatically entered into the selector. This also applies for the remove command.

#### `amdbutler:remove` (alt-r)
Displays a select view of all of your current imports. Selecting an import from the quick list removes it from your file. The imports are also automatically sorted.

## Installation
`apm install amdbutler`

## Settings
Check the settings page for this package from within atom to see available settings.

## Contributors
[@stdavis](http://github.com/stdavis)  
[@steveoh](http://github.com/steveoh)  
[@mokkabonna](http://github.com/mokkabonna)  
