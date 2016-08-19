import fbgraph from "fbgraph";

var fbHelper;

function Facebook() {
    this.fb = fbgraph;

    //accessToken
    var facebookConfig = JSON.parse(Assets.getText('facebook-config.json'));
    if (facebookConfig) {
        this.fb.setAccessToken(facebookConfig.appId + "|" + facebookConfig.secret);
    }

    this.fb.setVersion('2.3');
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    };
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
};

Facebook.prototype.getPagePosts = function (pageName, limit, until) {
    var query = pageName + '/posts?limit=' + limit + '&fields=id,message,object_id,type,link,created_time';
    if (until) {
        query += '&until=' + until;
    }
    return this.query(query);
};

Meteor.methods({
    getPagePosts: function (pageName, limit, until) {
        var data = fbHelper.getPagePosts(pageName, limit, until);
        return data;
    },

    getProcessedPagePosts: function (pageName, limit, until) {
        var postsData = Meteor.call("getPagePosts", pageName, limit, until);
        if (postsData && postsData.data) {
            var cards = [];
            _.each(postsData.data, function (post) {
                var card = {};
                card.id = post.id;
                card.message = post.message;
                card.link = post.link;
                card.createdTime = moment(post.created_time).format('DD MMMM');
                if (post.type == "photo") {
                    card.imageSource = post.object_id;
                }
                cards.push(card);
            });
            postsData.data = cards;
        }
        if (postsData && postsData.paging && postsData.paging.next) {
            var next = postsData.paging.next;
            var nextElements = next.split('&');
            _.each(nextElements, function (element) {
                if (element.indexOf("until=") > -1) {
                    var untilElements = element.split('=');
                    if (untilElements.length == 2) {
                        postsData.paging.previous = '';
                        postsData.paging.next = untilElements[1];
                    }
                }
            });
        }
        return postsData;
    }
});

Meteor.startup(function () {
    fbHelper = new Facebook();
});
