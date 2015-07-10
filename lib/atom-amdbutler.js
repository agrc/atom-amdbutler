var AtomAmdButlerView = require('./atom-amdbutler-view');
var CompositeDisposable = require('atom').CompositeDisposable;

module.exports =  {
    atomAmdButlerView: null,
    modalPanel: null,
    subscriptions: null,
    activate: function (state) {
        this.atomAmdButlerView = new AtomAmdButlerView(state.atomAmdButlerViewState);
        this.modalPanel = atom.workspace.addModalPanel({
            item: this.atomAmdButlerView.getElement(),
            visible: false
        });
        this.subscriptions = new CompositeDisposable;
        return this.subscriptions.add(atom.commands.add('atom-workspace', {
            'atom-amdbutler:toggle': (function (_this) {
                return function () {
                    return _this.toggle();
                };
            })(this)
        }));
    },

    deactivate: function () {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        return this.atomAmdButlerView.destroy();
    },

    serialize: function () {
        return {
            atomAmdButlerViewState: this.atomAmdButlerView.serialize()
        };
    },

    toggle: function () {
        console.log('AtomAmdButler was toggled!');
        if (this.modalPanel.isVisible()) {
            return this.modalPanel.hide();
        } else {
            return this.modalPanel.show();
        }
    }
};
