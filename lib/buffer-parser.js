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
        return new AtomRange(
            buffer.positionForCharacterIndex(start),
            buffer.positionForCharacterIndex(start + match.length)
        );
    }
};
