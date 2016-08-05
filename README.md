# meteor-facebook-feed

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/bmustata/icenodes?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

Meteor application for retrieving and displaying a Facebook page feed using Masonry cascading grid layout.

![Meteor Facebook feed](https://github.com/cambrozie/meteor-facebook-feed/blob/master/public/images/meteor-facebook-feed.jpg?raw=true)

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

# More demos

- http://meteor-facebook-feed.icenodes.com/social/EpicFoodPorn
- http://meteor-facebook-feed.icenodes.com/social/ArchDaily
- http://meteor-facebook-feed.icenodes.com/social/Expiredbeans

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

Copyright &copy; [ICENODES](https://icenodes.com). Licensed under the terms of the [MIT license](LICENSE.md).

Provided by ICENODES - www.icenodes.com
