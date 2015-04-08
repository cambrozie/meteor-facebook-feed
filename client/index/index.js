Template.index.created = function () {
    this.searchResults = new ReactiveVar("");
};

Template.index.events({
    'submit .searchPageForm': function (event, template) {
        var query = event.target.query.value;
        Meteor.call('searchForPage', query, function(err, pageResults) {
            if (err) {
                console.log(err);
            }
            else {
                template.searchResults.set(pageResults.data);
            }
        });

        // Clear form
        //event.target.query.value = "";

        // Prevent default form submit
        return false;
    },

    'click .search-result': function (event) {
        var selectedPageId = event.currentTarget.id;
        var selectedPageName = $("#" + selectedPageId).find('.page-name').text();

        console.log(selectedPageId);
        console.log(selectedPageName);

        if (selectedPageId != null && selectedPageName != null) {
            Router.go('posts', {pageName: selectedPageName, pageId: selectedPageId});
        }
    }
});

Template.index.helpers({
    searchResults: function () {
        return Template.instance().searchResults.get();
    }
});
