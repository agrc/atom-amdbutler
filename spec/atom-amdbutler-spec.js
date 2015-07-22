describe('AtomAmdButler', function () {
    beforeEach(function (done) {
        atom.packages.activatePackage('amdbutler').then(done);
    });
    it('sanity', function () {
        expect(true).toBe(true);
    });
});
