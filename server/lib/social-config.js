ServiceConfiguration.configurations.remove({
    service: 'facebook'
});

ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: '', // <-- Your Facebook application ID here
    secret: '' // <-- Your Facebook application secret here
});