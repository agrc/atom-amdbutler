// work around for coffee script stuff

var hasProp = {}.hasOwnProperty;
module.exports = {
    extend: function (child, parent) {
        for (var key in parent) {
            if (hasProp.call(parent, key)) {
                child[key] = parent[key];
            }
        }
        var Ctor = function () {
            this.constructor = child;
        };

        Ctor.prototype = parent.prototype;
        child.prototype = new Ctor();
        child.__super__ = parent.prototype;
        return child;
    }
};
