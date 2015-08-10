var path = require('path');
var glob = require('glob');
var title = require('change-case').title;
var ALIASES = require('./data/preferred-argument-aliases');
var JS_KEYWORDS = require('./data/js-keywords');

module.exports = {
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
                ') where found in the path to the current file (' + filePath + ')!';
        }

        return path.join(filePath.split(baseFolderName)[0], baseFolderName);
    },
    crawl: function (basePath, excludes) {
        var defaultExcludes = ['**/nls/**', '**/tests/**'];
        var options = {
            cwd: basePath,
            nodir: true,
            ignore: excludes.map(function (ex) {
                return ex.path + '.js';
            }).concat(defaultExcludes)
        };

        var that = this;
        return glob.sync('**/*.js', options).map(function (entry) {
            var modPath = entry.slice(0, -3);
            return {path: modPath, name: that.getParamName(modPath)};
        });
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
    }
};
