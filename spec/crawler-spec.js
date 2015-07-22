var crawler = require('../lib/crawler');
var path = require('path');

describe('crawler tests', function () {
    describe('getBaseFolderPath', function () {
        it('gets folder from path', function () {
            var path = '/Users/stdavis/Documents/Projects/wri-web/src/app/Test.js';
            var folderNames = ['src'];
            var expected = '/Users/stdavis/Documents/Projects/wri-web/src';

            expect(crawler.getBaseFolderPath(path, folderNames)).toBe(expected);
        });
        it('throws error if no match is found', function () {
            expect(function () {
                crawler.getBaseFolderPath('/blah/blah', ['hello']);
            }).toThrow();
        });
    });
    describe('crawl', function () {
        var folder = path.join(__dirname, 'data', 'crawlTest');
        it('gets module list', function () {
            var result = crawler.crawl(folder, []);

            expect(result).toEqual([
                {path: 'test/Module', name: 'Module'},
                {path: 'test/nlsdontskip/test', name: 'test'},
                {path: 'test/sub/ModuleTest', name: 'ModuleTest'},
                {path: 'test/sub/string', name: 'testString'},
                {path: 'test2/Module', name: 'Module'},
                {path: 'test2/dom-style', name: 'domStyle'},
                {path: 'test2/sub/Module', name: 'Module'}
            ]);
        });
        it('handles excludes', function () {
            var exclude = {path: 'test/sub/ModuleTest', name: 'ModuleTest'};
            var result = crawler.crawl(folder, [exclude]);

            expect(result.every(function (item) {
                return item.name !== exclude.name && item.path !== exclude.path;
            })).toBe(true);
        });
        it('gets param name', function () {
            expect(crawler.getParamName('test/dom-style')).toEqual('domStyle');
            expect(crawler.getParamName('test/window')).toEqual('testWindow');
        });
        it('gets preferred argument', function () {
            expect(crawler.getParamName('esri/basemaps')).toEqual('esriBasemaps');
            expect(crawler.getParamName('esri/styles/choropleth')).toEqual('esriStylesChoropleth');
        });
        it('handles js keywords', function () {
            expect(crawler.getParamName('test/sub/string')).toEqual('testString');
        });
    });
});
