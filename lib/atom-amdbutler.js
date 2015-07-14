var CompositeDisposable = require('atom').CompositeDisposable;

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
            'atom-amdbutler:add': this.add.bind(this)
        }));
    },
    deactivate: function () {
        console.log('amd-butler:deactivate');

        this.subscriptions.dispose();
    },

    // commands
    add: function () {
        console.log('amd-butler:add');
    }
};
