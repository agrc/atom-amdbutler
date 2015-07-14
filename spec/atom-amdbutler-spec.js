// var AtomAmdButer = require('../lib/atom-amdbutler');

describe('AtomAmdButler', function () {
    var workspaceElement;
    beforeEach(function (done) {
        workspaceElement = atom.views.getView(atom.workspace);
        atom.packages.activatePackage('amdbutler').then(done);
    });
    it('sanity', function () {
        expect(true).toBe(true);
    });
});
