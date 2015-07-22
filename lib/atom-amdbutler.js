var CompositeDisposable = require('atom').CompositeDisposable;
var crawler = require('./crawler');
var ModsView = require('./mods-view');

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
                'amdbutler:add': this.add.bind(this)
            }),
            this.modsView.onItemSelected(this.onModSelected.bind(this))
        );
    },
    deactivate: function () {
        console.log('amdbutler:deactivate');

        this.subscriptions.dispose();
    },

    onModSelected: function (item) {
        console.log(item, 'selected');
    },

    // commands
    add: function () {
        console.log('amdbutler:add');
        console.log(this.config.baseFolders);

        var buffer = atom.workspace.getActivePaneItem();

        // this could maybe go in the activate method then recrawl async
        // on changes to base folder
        var mods = crawler.crawl(
            crawler.getBaseFolderPath(buffer.getPath(),
            atom.config.get('amdbutler.baseFolders')),
            []
        );

        this.modsView.showMods(mods);
    }
};
