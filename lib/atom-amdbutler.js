var CompositeDisposable = require('atom').CompositeDisposable;
var crawler = require('./crawler');
var ModsView = require('./mods-view');
var bufferParser = require('./buffer-parser');
var zipper = require('./zipper');


module.exports =  {
    // settings
    config: {
        baseFolders: {
            type: 'array',
            'default': ['src'],
            items: {
                type: 'string'
            }
        }
    },

    subscriptions: null,

    modsView: null,

    activate: function () {
        console.log('amd-butler:activate');

        this.modsView = new ModsView();

        this.subscriptions = new CompositeDisposable();
        return this.subscriptions.add(
            atom.commands.add('atom-workspace', {
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

        // remove added item from mods available for adding again
        var i;
        buffer.__mods.forEach(function (m, x) {
            if (m === item) {
                i = x;
            }
        });
        buffer.__mods.splice(i, 1);

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

        // add item back into available mods for this buffer
        if (buffer.__mods) {
            buffer.__mods.push(item);
        }

        var pairs = this.getSortedPairs(buffer);
        this.updateWithPairs(buffer, pairs.filter(function (p) {
            return p.path !== item.path;
        }));

        buffer.groupChangesSinceCheckpoint(checkPoint);
    },
    updateWithPairs: function (buffer, pairs) {
        var importsRange = bufferParser.getImportsRange(buffer);
        var paramsRange = bufferParser.getParamsRange(buffer);

        var paramsTxt = zipper.generateParamsTxt(pairs, '    ', false);
        buffer.setTextInRange(paramsRange, paramsTxt);

        var importsTxt = zipper.generateImportsTxt(pairs, '    ');
        buffer.setTextInRange(importsRange, importsTxt);
    },
    _sort: function (buffer, checkPoint) {
        this.updateWithPairs(buffer, this.getSortedPairs(buffer));

        buffer.groupChangesSinceCheckpoint(checkPoint);
    },

    // commands
    add: function () {
        console.log('amdbutler:add');
        var buffer = atom.workspace.getActivePaneItem().buffer;

        // this could maybe go in the activate method then recrawl async
        // on changes to base folder
        if (!buffer.__mods) {
            buffer.__mods = crawler.crawl(
                crawler.getBaseFolderPath(buffer.getPath(),
                atom.config.get('amdbutler.baseFolders')),
                this.getSortedPairs(buffer)
            );
        }

        this.modsView.show(buffer.__mods, 'add');
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

        this.modsView.show(this.getSortedPairs(buffer), 'remove');
    }
};
