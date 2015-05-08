![image_meteor@2x.png](https://d14jjfgstdxsoz.cloudfront.net/meteor-development-group.png)

# meteor-facebook-feed
Meteor application for retrieving and displaying a Facebook page feed using Masonry cascading grid layout.

Currently we support:
- Displaying Facebook page feed
- Infinite scroll to load more posts
- Searching in the Facebook page using keywords
- Changing the Facebook page
- Refreshing posts

Notes:
- No database required since we don't store any posts information on the server
- Most of the logic is on the client side and the server only makes the requests to the Graph API.

You can see the demo at http://meteor-facebook-feed.icenodes.com

# Why

We are building a lot of internal projects and external projects like Startup MVPs and we needed a social feed aggregator and a cool way of displaying the posts.

# Requirements

- Meteor >= 0.9.0

# Quick start

- Download / Clone the repository `git clone https://github.com/cambrozie/meteor-facebook-feed`
- Navigate into your project directory 'cd meteor-facebook-feed'
- Put your Facebook 'appId' and 'secret' in `private/facebook-config.js` file
- Start the Meteor application with `meteor`
- Open `http://localhost:3000` in your browser

# License

Copyright &copy; 2014-2015 [ICENodes](http://icenodes.com). Licensed under the terms of the [MIT license](LICENSE.md).

Provided by ICENodes - www.icenodes.com
