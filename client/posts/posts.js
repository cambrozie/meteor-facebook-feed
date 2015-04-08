Template.posts.created = function () {
    self = this;
    self.displayedCards = new ReactiveVar("");
    Meteor.call('getPagePhotoPosts', Router.current().params.pageId, function (err, postData) {
        if (err) {
            console.log(err);
        }
        else {
            var cards = [];
            _.each(postData, function (post) {
                var card = {};
                card.message = post.message;
                card.link = post.link;
                card.createdTime = moment(post.created_time).format('DD MMMM');
                Meteor.call('getLargePhoto', post.object_id, function (err, imageData) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        card.imageSource = imageData.source;
                        cards.push(card);
                        self.displayedCards.set(cards);
                    }
                });
            });
        }
    });
};

Template.posts.helpers({
    displayedCards: function () {
        return Template.instance().displayedCards.get();
    }
});