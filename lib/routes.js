var OnBeforeActions;

OnBeforeActions = {
    loginRequired: function () {
        if (!Meteor.userId()) {
            this.redirect('/');
        }
        else {
            this.next();
        }
    }
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
    only: ['posts']
});

Router.route('/', function () {
    this.render('index');
});

Router.route('/posts/:pageName/:pageId', function () {
    this.render('posts', {
        data: function () {
            return {
                pageName: this.params.pageName,
                pageId: this.params.pageId
            };
        }
    });
}, {
    name: 'posts'
});