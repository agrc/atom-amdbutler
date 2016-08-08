var TextBuffer = require('atom').TextBuffer;
var bufferParser = require('../lib/buffer-parser');
var fs = require('fs');
var path = require('path');

describe('buffer-parser tests', function () {
    var readOptions = {encoding: 'utf8'};
    var testRegex = function (type, file) {
        var txt = fs.readFileSync(path.join(__dirname, 'data', file + '.js'), readOptions);
        var expected = fs.readFileSync(path.join(__dirname, 'data', file + '_' + type), readOptions);
        var buffer = new TextBuffer(txt);
        var range = (type === 'imports') ?
            bufferParser.getImportsRange(buffer) :
            bufferParser.getParamsRange(buffer);

        expect(buffer.getTextInRange(range)).toEqual(expected);
    };
    describe('getImportsRange', function () {
        var testImport = function (file) {
            testRegex('imports', file);
        };
        it('gets the range representing the imports', function () {
            testImport('Module');
        });
        it('handles imports without newlines', function () {
            testImport('SlourceModule');
        });
        it('handles require statement', function () {
            testImport('Module2');
        });
        it('handles jshint configs at top of file', function () {
            testImport('ModuleJSHint');
        });
        it('handles imports with the same name as parameter', function () {
            testImport('ModuleImportSameAsParam');
        });
        it('handles files with no imports', function () {
            testImport('Empty');
        });
        it('gets the proper range for empty files', function () {
            var txt = fs.readFileSync(path.join(__dirname, 'data', 'Empty.js'), readOptions);
            var range = bufferParser.getImportsRange(new TextBuffer(txt));

            expect(range.start.toString()).toEqual('(0, 8)');
            expect(range.end.toString()).toEqual('(2, 0)');
        });
    });
    describe('getParamsRange', function () {
        var testParam = function (file) {
            testRegex('params', file);
        };
        it('gets the range representing the params', function () {
            testParam('ModuleJSHint');
            testParam('Module');
            testParam('Module2');
        });
        it('handles params without newlines', function () {
            testParam('SlourceModule');
        });
        it('handles imports with the same name as parameter', function () {
            testParam('ModuleImportSameAsParam');
        });
        it('gets correct range for matching import param names', function () {
            var txt = fs.readFileSync(path.join(__dirname, 'data', 'ModuleImportSameAsParam.js'), readOptions);
            var buffer = new TextBuffer(txt);
            var range = bufferParser.getParamsRange(buffer);

            expect(range.start).toEqual({row: 0, column: 36});
            expect(range.end).toEqual({row: 0, column: 50});
        });
        it('handles files with no params', function () {
            testParam('Empty');
        });
    });
});
