Router.route('/', function () {
    this.redirect('/social/1mpics');
});

Router.route('/social/:pageName', function () {
    this.render('index', {
        data: function () {
            return {
                pageName: this.params.pageName
            };
        }
    });
}, {
    name: 'index'
});