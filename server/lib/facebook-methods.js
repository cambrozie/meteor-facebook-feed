function Facebook(accessToken) {
    this.fb = Meteor.npmRequire('fbgraph');
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.fb.setVersion('2.2');
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    }
    this.fb.setOptions(this.options);
}

Facebook.prototype.query = function (query, method) {
    var self = this;
    var method = (typeof method === 'undefined') ? 'get' : method;
    var data = Meteor.sync(function (done) {
        self.fb[method](query, function (err, res) {
            done(null, res);
        });
    });
    return data.result;
}

var MAX_RETRIEVED_POSTS = 5;

Facebook.prototype.getPagePhotoPosts = function (id) {
    var posts = [];

    //gets the last 5 photo type posts, only the id, message and object_id(needed for full size image) fields, order by default in descending chronological order
    var postsObject = this.query(id + '/promotable_posts?type=PHOTO&limit=10&fields=id,message,object_id,link,created_time');
    // the query above actually fetches the last 10 posts increasing the chance of finding 5 PHOTO posts among them

    if (postsObject.data.length > 0) {
        if (postsObject.data.length < MAX_RETRIEVED_POSTS) {
            var remainingPostsNumber = MAX_RETRIEVED_POSTS - postsObject.data.length; //calculate number of remaining posts
            posts = _.first(postsObject.data, postsObject.data.length); //copy the retrieved posts
            if (postsObject.paging.next != null) {
                postsObject = this.query(postsObject.paging.next); // get next posts
                while (remainingPostsNumber > 0) {
                    if (postsObject.data.length == 0) {
                        if (postsObject.paging.next != null) {
                            postsObject = this.query(postsObject.paging.next); // get next posts
                        }
                        else {
                            break;
                        }
                    }
                    var post = postsObject.data.shift();
                    posts.push(post);
                    remainingPostsNumber--;
                }
            }
        }
        else {
            //copy 5 posts
            posts = _.first(postsObject.data, MAX_RETRIEVED_POSTS);
        }
    }
    return posts;
}

Facebook.prototype.getLargePhoto = function (id) {
    return this.query(id + "?fields=source");
}

Facebook.prototype.searchForPage = function (query) {
    return this.query("/search?q=" + query + "&type=page");
}

Meteor.methods({
    getPagePhotoPosts: function (page_id) {
        var fb = new Facebook(Meteor.user().services.facebook.accessToken);
        var data = fb.getPagePhotoPosts(page_id);
        return data;
    },

    getLargePhoto: function (object_id) {
        var fb = new Facebook(Meteor.user().services.facebook.accessToken);
        var data = fb.getLargePhoto(object_id);
        return data;
    },

    searchForPage: function (query) {
        var fb = new Facebook(Meteor.user().services.facebook.accessToken);
        var data = fb.searchForPage(query);
        return data;
    }
});
