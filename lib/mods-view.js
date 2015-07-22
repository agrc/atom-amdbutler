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
    this.emitter = new Emitter();
    this.addClass('overlay from-top');
    this.setMaxItems(10);
    if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
            item: this
        });
    }
};
ModsView.prototype.getFilterKey = function () {
    return 'path';
};
ModsView.prototype.onItemSelected = function (callback) {
    this.emitter.on('item-selected', callback);
};
ModsView.prototype.viewForItem = function (item) {
    // return '<li class="two-lines"><div class="primary-line"' + item.path + '</li>';
    var li = put('li.two-lines');
    put(li, 'div.primary-line', {innerHTML: item.path});
    put(li, 'div.secondary-line', {innerHTML: item.name});
    return li;
};
ModsView.prototype.confirmed = function (item) {
    this.emitter.emit('item-selected', item);
    this.panel.hide();
};
ModsView.prototype.cancelled = function () {
    return console.log('This view was cancelled');
};
ModsView.prototype.showMods = function (items) {
    this.setItems(items);
    this.panel.show();
    return this.focusFilterEditor();
};
ModsView.prototype.destroy = function () {
    this.emitter.dispose();
};

module.exports = ModsView;
