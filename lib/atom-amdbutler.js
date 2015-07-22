var CompositeDisposable = require('atom').CompositeDisposable;
var crawler = require('./crawler');

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

    activate: function () {
        console.log('amd-butler:activate');

        this.subscriptions = new CompositeDisposable();
        return this.subscriptions.add(atom.commands.add('atom-workspace', {
            'amdbutler:add': this.add.bind(this)
        }));
    },
    deactivate: function () {
        console.log('amdbutler:deactivate');

        this.subscriptions.dispose();
    },

    // commands
    add: function () {
        console.log('amdbutler:add');
        console.log(this.config.baseFolders);

        var buffer = atom.workspace.getActivePaneItem();

        var mods = crawler.crawl(
            crawler.getBaseFolderPath(buffer.getPath(),
            atom.config.get('amdbutler.baseFolders')),
            []
        );

        console.log(mods);
    }
};
