var SelectListView = require('atom-space-pen-views').SelectListView;
var coffee = require('./coffee');
var Emitter = require('event-kit').Emitter;
// put defines a global 'put' command because
// atom tricks it into thinking that it's a browser
// https://github.com/kriszyp/put-selector/blob/master/put.js#L221
require('put-selector');


var ModsView;
coffee.extend(ModsView, SelectListView);

function ModsView() {
    return ModsView.__super__.constructor.apply(this, arguments);
}

ModsView.prototype.initialize = function () {
    ModsView.__super__.initialize.apply(this, arguments);
    this.action = null; // add | remove
    this.emitter = new Emitter();
    this.addClass('overlay from-top');
    this.setMaxItems(10);
};
ModsView.prototype.getFilterKey = function () {
    return 'path';
};
ModsView.prototype.onAddItemSelected = function (callback) {
    return this.emitter.on('add-item-selected', callback);
};
ModsView.prototype.onRemoveItemSelected = function (callback) {
    return this.emitter.on('remove-item-selected', callback);
};
ModsView.prototype.viewForItem = function (item) {
    // return '<li class="two-lines"><div class="primary-line"' + item.path + '</li>';
    var li = put('li.two-lines');
    put(li, 'div.primary-line', {innerHTML: item.path});
    put(li, 'div.secondary-line', {innerHTML: item.name});
    return li;
};
ModsView.prototype.confirmed = function (item) {
    console.log('confirmed');
    this.emitter.emit(this.action + '-item-selected', item);
    this.hide();
};
ModsView.prototype.cancelled = function () {
    this.hide();
    return console.log('This view was cancelled');
};
ModsView.prototype.hide = function () {
    this.panel.hide();
    this.restoreFocus();
};
ModsView.prototype.show = function (items, action, excludePaths, prefilledInput) {
    console.log('show', arguments);
    excludePaths = (excludePaths) ? excludePaths : [];
    this.action = action;
    this.storeFocusedElement();
    if (!this.panel) {
        this.panel = atom.workspace.addModalPanel({
            item: this
        });
    }
    this.panel.show();
    this.setItems(items.filter(function (i) {
        return excludePaths.indexOf(i.path) === -1;
    }));

    if (prefilledInput) {
        var input = this.filterEditorView.getModel();
        input.setText(prefilledInput);
        input.selectAll();
    }

    return this.focusFilterEditor();
};
ModsView.prototype.destroy = function () {
    this.emitter.dispose();
};

module.exports = ModsView;
