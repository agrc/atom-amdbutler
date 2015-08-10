module.exports = {
    importsRe: new RegExp(/[\'"](.+?)[\'"]/g),
    paramsRe: new RegExp(/(\w+?)([,\s]|$)/g),

    zip: function (importsTxt, paramsTxt) {
        var findAll = function (reg, txt) {
            var all = [];
            var match;
            while ((match = reg.exec(txt)) !== null) {
                all.push(match[1]);
            }
            return all;
        };

        var imports = findAll(this.importsRe, importsTxt);
        var params = findAll(this.paramsRe, paramsTxt);

        var pairs = imports.map(function (imp, i) {
            return {
                path: imp,
                name: params[i]
            };
        });

        pairs.sort(function (a, b) {
            var aPath = a.path.toUpperCase();
            var bPath = b.path.toUpperCase();
            if (aPath > bPath) {
                return 1;
            } else if (aPath < bPath) {
                return -1;
            }
            return 0;
        });

        // move imports with no param to the bottom of the list
        var noParams = pairs.filter(function (p) {
            return !p.name;
        });
        pairs = pairs.filter(function (p) {
            return p.name;
        });
        return pairs.concat(noParams);
    },
    generateImportsTxt: function (pairs, indent) {
        var currentPackage;
        var txt = '';
        var NOPARAM = 'NOPARAM';
        pairs.forEach(function (p) {
            var newPackage = p.path.split('/')[0];
            if (!currentPackage) {
                currentPackage = newPackage;
            } else if (currentPackage !== newPackage && currentPackage !== NOPARAM) {
                txt += ',\n';
                if (p.name) {
                    currentPackage = newPackage;
                } else {
                    currentPackage = NOPARAM;
                }
            } else {
                txt += ',';
            }

            txt += '\n' + indent + '\'' + p.path + '\'';
        });
        txt += '\n';

        return txt;
    },
    generateParamsTxt: function (pairs, indent, oneLine) {
        // normal settings
        var initialTxt = '';
        var endLineTxt = ',\n';
        var afterItemTxt = ',';
        var everyIterTxt = '\n' + indent;

        if (oneLine) {
            initialTxt = '\n' + indent;
            endLineTxt = ',\n' + indent;
            afterItemTxt = ', ';
            everyIterTxt = '';
        }

        var txt = initialTxt;
        var newPackage;
        var currentPackage;
        pairs.forEach(function (p) {
            newPackage = p.path.split('/')[0];
            if (p.name) {
                if (!currentPackage) {
                    currentPackage = newPackage;
                } else if (currentPackage !== newPackage) {
                    txt += endLineTxt;
                    currentPackage = newPackage;
                } else {
                    txt += afterItemTxt;
                }
                txt += everyIterTxt + p.name;
            }
        });
        txt += '\n';

        return txt;
    }
};
