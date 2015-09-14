var crawler = require('../lib/crawler');
var path = require('path');
var os = require('os');


describe('crawler tests', function () {
    describe('getBaseFolderPath', function () {
        it('gets folder from path', function () {
            var path;
            var expected;
            if (os.platform() === 'win32') {
                path = 'C:\\Users\\stdavis\\Documents\\Projects\\wri-web\\src\\app\\Test.js';
                expected = 'C:\\Users\\stdavis\\Documents\\Projects\\wri-web\\src';
            } else {
                path = '/Users/stdavis/Documents/Projects/wri-web/src/app/Test.js';
                expected = '/Users/stdavis/Documents/Projects/wri-web/src';
            }

            var folderNames = ['src'];

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

            expect(result.length).toBe(7);
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
