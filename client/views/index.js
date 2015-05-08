var MAX_RETRIEVED_POSTS = 20;

displayedCards = new ReactiveVar('');
retrievedCards = new ReactiveVar('');
keywords = new ReactiveVar('');

function getInitialCards() {

    var fbPage = Session.get("fbPage");
    if (fbPage) {
        //get page posts
        Meteor.call('getProcessedPagePosts', fbPage, MAX_RETRIEVED_POSTS, function (err, postsData) {
            if (err) {
                console.log(err);
                Session.set("retrievingCards", false);
            }
            else {
                if (postsData && postsData.data) {

                    displayedCards.set(postsData.data);
                    retrievedCards.set(postsData.data);

                    $('#refreshPostsButton').removeClass('disabled');

                    //pagination
                    if (postsData.paging.next) {
                        Session.set("nextPostsUntil", postsData.paging.next);
                    }
                    else {
                        Session.set("nextPostsUntil", "");
                    }
                }
                Session.set("retrievingCards", false);
            }
        });
    }
}

function loadMoreCards() {
    if (!Session.get("retrievingCards")) {
        Session.set("retrievingCards", true);
        var fbPage = Session.get("fbPage");
        var nextPostsUntil = Session.get("nextPostsUntil");
        if (fbPage && nextPostsUntil) {
            //get page posts
            Meteor.call('getProcessedPagePosts', fbPage, MAX_RETRIEVED_POSTS, nextPostsUntil, function (err, postsData) {
                if (err) {
                    console.log(err);
                    Session.set("retrievingCards", false);
                }
                else {
                    if (postsData && postsData.data) {
                        var lastCard = retrievedCards.get()[retrievedCards.get().length - 1];
                        var newCards = [];

                        //First post from the "next" posts if the same as the last post from the previous set of posts, Facebook magic dunno :)
                        //Probably something to do with the until timestamp, easy fix is to remove it so we don't have duplicate posts
                        if (lastCard && (lastCard.id == postsData.data[0].id)) {
                            newCards = _.rest(postsData.data, 1);
                        }
                        else {
                            newCards = postsData.data;
                        }

                        retrievedCards.set(retrievedCards.get().concat(newCards));

                        // search keywords
                        if (keywords.get()) {
                            var filteredCards = [];
                            var keywordsArray = [];
                            _.each(keywords.get(), function(introducedKeyword){
                                    keywordsArray.push(introducedKeyword.keyword);
                            });
                            var regex = new RegExp(keywordsArray.join("|").toLocaleLowerCase());
                            _.each(retrievedCards.get(), function (card) {
                                if (card.message) {
                                    if (regex.test(card.message.toLowerCase())) {
                                        filteredCards.push(card);
                                    }
                                }
                            });
                            displayedCards.set(filteredCards);
                        }
                        else {
                            displayedCards.set(displayedCards.get().concat(newCards));
                        }

                        //pagination
                        if (postsData.paging.next) {
                            Session.set("nextPostsUntil", postsData.paging.next);
                        }
                        else {
                            Session.set("nextPostsUntil", "");
                        }
                    }
                    Session.set("retrievingCards", false);
                }
            });
        }
    }
}

function refreshPosts() {
    $('#searchInput').val('');
    keywords.set('');
    displayedCards.set('');
    retrievedCards.set('');
    getInitialCards();
}

function trimSpaces(string){
    string = string.replace(/(^\s*)|(\s*$)/gi,"");
    string = string.replace(/[ ]{2,}/gi," ");
    string = string.replace(/\n /,"\n");
    return string;
}

Template.index.created = function () {
    Session.set("fbPage", Router.current().params.pageName);
}

Template.index.onRendered(function () {
    refreshPosts();

});

Template.postsContainerTemplate.onRendered(function () {

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
            loadMoreCards();
        }
    });
});

Template.index.events({

    'submit .changePageForm': function (event) {
        event.preventDefault();

        $("#changePageModal").modal("hide");
        var newPage = event.target.pageName.value;

        if (newPage) {
            Session.set("fbPage", newPage);
            Router.go('index', {pageName: newPage});
            refreshPosts();
        }

        // Prevent default form submit
        return false;
    },

    'click #refreshPostsButton': function () {
        refreshPosts();
    },

    'click #searchButton': function () {
        if (Session.get("fbPage")) {
            if (retrievedCards.get() && $('#searchInput').val()) {
                var introducedKeywords = trimSpaces($('#searchInput').val()).split(' ');
                var keywordsObjects = [];
                _.each(introducedKeywords, function(introducedKeyword) {
                    keywordsObjects.push({
                        keyword : introducedKeyword
                    });
                });
                keywords.set(keywordsObjects);
                var filteredCards = [];
                var regex = new RegExp(introducedKeywords.join("|").toLocaleLowerCase());
                _.each(retrievedCards.get(), function (card) {
                    if (card.message) {
                        if (regex.test(card.message.toLowerCase())) {
                            filteredCards.push(card);
                        }
                    }
                });
                displayedCards.set(filteredCards);
            }
            else {
                refreshPosts();
            }
        }
    },

    'click #loadMorePostsButton': function () {
        loadMoreCards();
    }
});

Template.index.helpers({
    fbPage: function () {
        return Session.get("fbPage");
    },

    displayedCards: function () {
        return displayedCards.get();
    },

    retrievedCards: function () {
        return retrievedCards.get();
    },

    keywords : function() {
      return keywords.get();
    }
});

Template.postsContainerTemplate.helpers({
    displayedCards: function () {
        return displayedCards.get();
    }
});