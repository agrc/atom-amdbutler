var zipper = require('../lib/zipper');
var fs = require('fs');
var path = require('path');

describe('zipper tests', function () {
    var readOptions = {encoding: 'utf8'};
    var pairs = [
        {path: 'dijit/_TemplatedMixin', name: '_TemplatedMixin'},
        {path: 'dijit/_WidgetBase', name: '_WidgetBase'},
        {path: 'dijit/_WidgetsInTemplateMixin', name: '_WidgetsInTemplateMixin'},
        {path: 'dojo/_base/array', name: 'array'},
        {path: 'dojo/_base/Color', name: 'Color'},
        {path: 'dojo/_base/declare', name: 'declare'},
        {path: 'dojo/_base/lang', name: 'lang'},
        {path: 'dojo/dom-class', name: 'domClass'},
        {path: 'dojo/dom-style', name: 'domStyle'},
        {path: 'dojo/has', name: 'has'},
        {path: 'dojo/keys', name: 'keys'},
        {path: 'dojo/on', name: 'on'},
        {path: 'dojo/text!app/templates/GeoSearch.html', name: 'template'},
        {path: 'dijit/form/ValidationTextBox', name: undefined},
        {path: 'dojo/domReady!', name: undefined}
    ];
    describe('zip', function () {
        var getPairs = function (importsFile, paramsFile) {
            var importsTxt = fs.readFileSync(path.join(__dirname, 'data', importsFile), readOptions);
            var paramsTxt = fs.readFileSync(path.join(__dirname, 'data', paramsFile), readOptions);

            return zipper.zip(importsTxt, paramsTxt);
        };

        it('zips together import and params text', function () {
            var pairs = getPairs('imports', 'params');

            expect(pairs.length).toBe(15);
            expect(pairs[0].path).toEqual('dijit/_TemplatedMixin');
            expect(pairs[0].name).toEqual('_TemplatedMixin');
            expect(pairs[pairs.length - 1]).toEqual({
                path: 'dijit/form/ValidationTextBox',
                name: undefined
            });

            var pairs2 = getPairs('imports2', 'params2');

            expect(pairs2.length).toBe(19);
            expect(pairs2[pairs2.length - 2].path).toEqual('agrc/widgets/locate/FindAddress');
            expect(pairs2[pairs2.length - 2].name).toBeUndefined();
            expect(pairs2[pairs2.length - 1].path).toEqual('dojo/_base/sniff');
            expect(pairs2[pairs2.length - 1].name).toBeUndefined();
        });
        it('can handle slource code', function () {
            var pairs = getPairs('imports_slource', 'params_slource');

            expect(pairs.length).toBe(22);
            expect(pairs[0].path).toEqual('../deferredUtils');
            expect(pairs[0].name).toEqual('A');
            expect(pairs[pairs.length - 1].path).toEqual('require');
            expect(pairs[pairs.length - 1].name).toBeUndefined();
        });
        it('sorts case-insensitively', function () {
            var pairs = getPairs('imports_case', 'params_case');

            expect(pairs.length).toBe(3);
            expect(pairs[0].path).toEqual('app/config');
            expect(pairs[1].path).toEqual('app/GeoSearch');
        });
        it('handles matching import and params', function () {
            var pairs = getPairs('ModuleImportSameAsParam_imports', 'ModuleImportSameAsParam_params');

            expect(pairs.length).toBe(1);
            expect(pairs[0].path).toEqual('currentSession');
            expect(pairs[0].name).toEqual('currentSession');
        });
        it('handles special characters in params such as "$"', function () {
            var pairs = getPairs('imports_with_jquery', 'params_with_jquery');

            expect(pairs.length).toBe(4);
            expect(pairs[2].name).toBe('$');
            expect(pairs[2].path).toBe('jquery');
        });
    });
    describe('generateImportsText', function () {
        it('generates the appropriate imports text', function () {
            var result = zipper.generateImportsTxt(pairs, '    ', true);
            var expected = fs.readFileSync(path.join(__dirname, 'data', 'imports_txt'), readOptions);

            expect(result).toEqual(expected);
        });
        it('generates the appropriate imports text with no package separation', function () {
            var result = zipper.generateImportsTxt(pairs, '    ', false);
            var expected = fs.readFileSync(path.join(__dirname, 'data', 'imports_txt_no_separation'), readOptions);

            expect(result).toEqual(expected);
        });
    });
    describe('generateParamsTxt', function () {
        it('generates the appropriate params text', function () {
            var result = zipper.generateParamsTxt(pairs, '    ', false, true);
            var expected = fs.readFileSync(path.join(__dirname, 'data', 'params_txt'), readOptions);

            expect(result).toEqual(expected);
        });
        it('generates the appropriate params text with no package separation', function () {
            var result = zipper.generateParamsTxt(pairs, '    ', false, false);
            var expected = fs.readFileSync(path.join(__dirname, 'data', 'params_txt_no_separation'), readOptions);

            expect(result).toEqual(expected);
        });
        it('supports oneline option', function () {
            var result = zipper.generateParamsTxt(pairs, '    ', true, true);
            var expected = fs.readFileSync(path.join(__dirname, 'data', 'params_txt_oneline'), readOptions);

            expect(result).toEqual(expected);
        });
        it('supports oneline option, ignores no separation option', function () {
            var result = zipper.generateParamsTxt(pairs, '    ', true, false);
            var expected = fs.readFileSync(path.join(__dirname, 'data', 'params_txt_oneline'), readOptions);

            expect(result).toEqual(expected);
        });
    });
});
