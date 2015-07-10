var AtomAmdbutlerView;

module.exports = AtomAmdbutlerView = (function () {
    function AtomAmdbutlerView(serializedState) {
        this.element = document.createElement('div');
        this.element.classList.add('atom-amdbutler');

        var message = document.createElement('div');
        message.textContent = 'The AtomAmdbutler package is Alive!';
        message.classList.add('message');

        this.element.appendChild(message);
    }

    AtomAmdbutlerView.prototype.serialize = function () {};

    AtomAmdbutlerView.prototype.destroy = function () {
        return this.element.remove();
    };

    AtomAmdbutlerView.prototype.getElement = function () {
        return this.element;
    };

    return AtomAmdbutlerView;

})();
