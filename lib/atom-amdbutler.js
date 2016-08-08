var CompositeDisposable = require('atom').CompositeDisposable;
var crawler = require('./crawler');
var ModsView = require('./mods-view');
var bufferParser = require('./buffer-parser');
var zipper = require('./zipper');
var path = require('path');


module.exports =  {
    // settings
    config: {
        baseFolders: {
            type: 'array',
            'default': ['src'],
            items: {
                type: 'string'
            },
            description: 'A comma-separated list of folder names to be used as base folders.' +
                ' Any file that you want to add imports to must have one of these folders in it\'s path.'
        },
        separatePackages: {
            type: 'boolean',
            'default': true,
            description: 'If you want to separate groups of modules from packages with an additional newline.'
        }
    },

    subscriptions: null,

    modsView: null,

    activate: function () {
        console.log('amd-butler:activate');

        this.modsView = new ModsView();

        this.subscriptions = new CompositeDisposable();

        return this.subscriptions.add(
            atom.commands.add('atom-text-editor[data-grammar="source js"]', {
                'amdbutler:add': this.add.bind(this),
                'amdbutler:sort': this.sort.bind(this),
                'amdbutler:remove': this.remove.bind(this)
            }),
            this.modsView.onAddItemSelected(this.onAddModSelected.bind(this)),
            this.modsView.onRemoveItemSelected(this.onRemoveModSelected.bind(this))
        );
    },
    deactivate: function () {
        console.log('amdbutler:deactivate');

        this.subscriptions.dispose();
        crawler.destroy();
    },
    getSortedPairs: function (buffer) {
        var importsRange = bufferParser.getImportsRange(buffer);
        var paramsRange = bufferParser.getParamsRange(buffer);
        return zipper.zip(buffer.getTextInRange(importsRange), buffer.getTextInRange(paramsRange));
    },
    onAddModSelected: function (item) {
        var buffer = atom.workspace.getActivePaneItem().buffer;

        // create a checkpoint to allow for a single undo for this entire operation
        var checkPoint = buffer.createCheckpoint();

        // add pair
        var paramsPoint = bufferParser.getParamsRange(buffer).start;
        buffer.insert(paramsPoint, item.name + ',');
        var importsPoint = bufferParser.getImportsRange(buffer).start;
        buffer.insert(importsPoint, '\'' + item.path + '\',');

        this._sort(buffer, checkPoint);
    },
    onRemoveModSelected: function (item) {
        console.log('onRemoveModSelected');
        // TODO: refactor shared code with onAddModSelected
        var buffer = atom.workspace.getActivePaneItem().buffer;

        var checkPoint = buffer.createCheckpoint();

        var pairs = this.getSortedPairs(buffer);
        this.updateWithPairs(buffer, pairs.filter(function (p) {
            return p.path !== item.path;
        }));

        buffer.groupChangesSinceCheckpoint(checkPoint);
    },
    updateWithPairs: function (buffer, pairs) {
        var importsRange = bufferParser.getImportsRange(buffer);
        var paramsRange = bufferParser.getParamsRange(buffer);
        var indentationSize = atom.config.get('editor.tabLength');
        var indentationString = '';
        for (var i = 0; i < indentationSize; i++) {
            indentationString += ' ';
        }
        var separatePackages = atom.config.get('amdbutler.separatePackages');

        var paramsTxt = zipper.generateParamsTxt(pairs, indentationString, false, separatePackages);
        buffer.setTextInRange(paramsRange, paramsTxt);

        var importsTxt = zipper.generateImportsTxt(pairs, indentationString, separatePackages);
        buffer.setTextInRange(importsRange, importsTxt);
    },
    _sort: function (buffer, checkPoint) {
        this.updateWithPairs(buffer, this.getSortedPairs(buffer));

        buffer.groupChangesSinceCheckpoint(checkPoint);
    },
    _getWordUnderCursor: function () {
        var underCursor = atom.workspace.getActivePaneItem().getWordUnderCursor();
        var match =  /\w+/i.exec(underCursor);
        return match && match[0];
    },
    ensureModulesAreLoaded: function (bufferPath) {
        if (!crawler.modules) {
            var baseFolderPath = crawler.getBaseFolderPath(bufferPath, atom.config.get('amdbutler.baseFolders'));

            if (!baseFolderPath) {
                return;
            }

            var currentProject = bufferPath.slice(baseFolderPath.length + 1).split(path.sep)[0];
            crawler.crawl(baseFolderPath, currentProject);
        }
    },

    // commands
    add: function () {
        console.log('amdbutler:add');
        var buffer = atom.workspace.getActivePaneItem().buffer;

        this.ensureModulesAreLoaded(buffer.getPath());

        if (!crawler.modules) {
            atom.notifications.addWarning('No imports found.');
            return;
        }

        var excludes = this.getSortedPairs(buffer).map(function (i) {
            return i.path;
        });

        this.modsView.show(crawler.modules, 'add', excludes, this._getWordUnderCursor());
    },
    sort: function () {
        console.log('amdbutler:sort');
        var buffer = atom.workspace.getActivePaneItem().buffer;
        var checkPoint = buffer.createCheckpoint();

        this._sort(buffer, checkPoint);
    },
    remove: function () {
        console.log('amdbutler:remove');

        var buffer = atom.workspace.getActivePaneItem().buffer;

        this.modsView.show(this.getSortedPairs(buffer), 'remove', null, this._getWordUnderCursor());
    }
};
