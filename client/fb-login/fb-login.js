Template.login.events({
    'click #facebook-login': function(event) {
        Meteor.loginWithFacebook({
            //requestPermissions: ['public_profile', 'email', 'user_friends'] -> default permissions
        }, function(err){
            if (err) {
                throw new Meteor.Error("Facebook login failed");
            }
            //else{
            //    console.log(Meteor.user());
            //}
        });
    },

    'click #facebook-logout': function(event) {
        Meteor.logout(function(err){
            if (err) {
                throw new Meteor.Error("Logout failed");
            }
        })
    }
});