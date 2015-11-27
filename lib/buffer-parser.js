var AtomRange = require('atom').Range;

module.exports = {
    reg: new RegExp(/(?:define|require)\s*\(\s*\[([\S\s]+?)\]\s*,\s*function\s*\(([\S\s]+?)\)/),

    getImportsRange: function (buffer) {
        return this._getRange(buffer, 1);
    },
    getParamsRange: function (buffer) {
        return this._getRange(buffer, 2);
    },
    _getRange: function (buffer, paramIndex) {
        var txt = buffer.getText();
        var result = this.reg.exec(txt);
        var match = result[paramIndex];
        var start = txt.indexOf(match);
        if (paramIndex === 2) {
            // check to see if the params and imports match each other
            var importsStart = txt.indexOf(result[1]);
            if (start === importsStart + 1) {
                // we have the imports, search for the next match which should be the params
                start = txt.indexOf(match, start + 1);
            }
        }
        return new AtomRange(
            buffer.positionForCharacterIndex(start),
            buffer.positionForCharacterIndex(start + match.length)
        );
    }
};
