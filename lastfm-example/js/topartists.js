// Create a cache object
var cache = new LastFMCache();

// Create a LastFM object
var lastfm = new LastFM({
    apiKey    : '828c109e6a54fffedad5177b194f7107',
    apiSecret : '7c2f09e6eb84e8a6183c59e0bc574f70',
    cache     : cache
});

// Execute this code when the document is ready :
jQuery(document).ready(function() {
    
    // Get and show the 10 top artists for user noisedriver :
    getTopArtists('noisedriver', 10);
});

/**
 * Appends the top artists for a certain user to the
 * #topartists element of the HTML page.
 * @param {type} user
 * @param {type} limit
 * @returns {undefined}
 */
function getTopArtists(user, limit) {
    // Get the top artists for this user
    lastfm.user.getTopArtists({
        user: user,
        limit: limit
    },
    {
        success: function(data) {
            // Create HTML to append to the #topartists element :
            var list = '<ol>';
            for (var i = 0; i < data.topartists.artist.length; i++) {
                // Append new element to "#topartists"
                list += '<li>' + data.topartists.artist[i].name + '</li>';
            }
            jQuery(list + '</ol>').appendTo('#topartists');
        },
        error: function(data) {
            // Show error message.
            alert(data.error + " " + data.message);
        }
    });
}