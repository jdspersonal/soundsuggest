// Onload
jQuery(document).ready(function() {

    var user = 'noisedriver';
    var api_key = '828c109e6a54fffedad5177b194f7107';
    var api_secret = '7c2f09e6eb84e8a6183c59e0bc574f70';
    var cb = window.location;
    var authURL = 'http://www.last.fm/api/auth/?api_key=' + api_key + '&cb=' + cb;
    var token = '';
    var lastfm;
    var cache;

    if (!$.url().param('token')) {
        window.location = authURL;
    } else {
        token = $.url().param('token');

        // Create a cache object
        cache = new LastFMCache();

        // Create a LastFM object
        lastfm = new LastFM({
            apiKey: api_key,
            apiSecret: api_secret,
            cache: cache
        });

        lastfm.auth.getSession({
            token: token
        }, {
            success: function(data_sess) {

                lastfm.user.getRecommendedArtists({
                    user: user,
                    limit: 10
                },
                data_sess.session,
                {
                    success: function(data_recs) {
                        var list = '<ol>';
                        for (var i = 0; i < data_recs.recommendations.artist.length; i++) {
                            list += '<li>' + data_recs.recommendations.artist[i].name + '</li>';
                        }
                        jQuery(list + '</ol>').appendTo('#recommended-artists');
                    },
                    error: function(data_recs_error) {
                        alert(data_recs_error.error + " : " + data_recs_error.message);
                    }
                });
            },
            error: function(data_sess_error) {
                alert(data_sess_error.error + " : " + data_sess_error.message);
            }
        });
    }
});
