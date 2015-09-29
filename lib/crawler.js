var path = require('path');
var glob = require('glob');
var title = require('change-case').title;
var ALIASES = require('./data/preferred-argument-aliases');
var JS_KEYWORDS = require('./data/js-keywords');
var chokidar = require('chokidar');

module.exports = {
    modules: null,
    getBaseFolderPath: function (filePath, baseFolderNames) {
        var baseFolderName;
        baseFolderNames.some(function (name) {
            var regex = new RegExp('\\' + path.sep + name + '\\' + path.sep);
            if (filePath.match(regex)) {
                baseFolderName = name;
                return true;
            } else {
                return false;
            }
        });

        // TODO: error handle not finding the path
        if (!baseFolderName) {
            throw 'None of the base folders (' + baseFolderNames.join(',') +
                ') were found in the path to the current file (' + filePath + ')!';
        }

        return path.join(filePath.split(baseFolderName)[0], baseFolderName);
    },
    crawl: function (basePath, currentPackage) {
        var excludes = ['**/nls/**', '**/tests/**'];
        var options = {
            cwd: basePath,
            nodir: true,
            ignore: excludes
        };

        var that = this;
        this.modules = glob.sync('**/*.js', options).map(function (entry) {
            return that.getModuleFromPath(entry);
        });

        // only watch files in the current package so that we aren't watching all of the
        // project dependencies
        var watcher = chokidar.watch(path.join(basePath, currentPackage) + '/**/*.js', {
            ignored: excludes,
            ignoreInitial: true
        });
        watcher.on('ready', function () {
            watcher.on('add', function (entry) {
                console.log('added: ', entry);
                that.modules.push(that.getModuleFromPath(entry, basePath));
            });
            watcher.on('unlink', function (entry) {
                that.removeModule(entry, basePath);
            });
        });
    },
    getModuleFromPath: function (entry, basePath) {
        var modPath = entry.slice(0, -3);
        if (basePath) {
            modPath = modPath.replace(basePath + '/', '');
        }
        return {path: modPath, name: this.getParamName(modPath)};
    },
    removeModule: function (entry, basePath) {
        var mod = this.getModuleFromPath(entry, basePath);
        var index;
        this.modules.some(function (m, i) {
            if (m.path === mod.path) {
                index = i;
                return true;
            } else {
                return false;
            }
        });

        if (index) {
            this.modules.splice(index, 1);
        }
    },
    getParamName: function (mod) {
        if (Object.keys(ALIASES).indexOf(mod) !== -1) {
            return ALIASES[mod];
        }

        var modParts = mod.split('/');
        var name = modParts[modParts.length - 1];
        if (JS_KEYWORDS.indexOf(name) !== -1) {
            return modParts[0] + title(name);
        } else if (name.indexOf('-') !== -1) {
            var words = name.split('-');
            return words[0] + title(words[1]);
        } else {
            return name;
        }
    },
    destroy: function () {
        chokidar.close();
    }
};
