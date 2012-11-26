// Onload
jQuery(document).ready(function() {

    var user = 'noisedriver';

    // Create a cache object
    var cache = new LastFMCache();

    // Create a LastFM object
    var lastfm = new LastFM({
        apiKey    : '828c109e6a54fffedad5177b194f7107',
        apiSecret : '7c2f09e6eb84e8a6183c59e0bc574f70',
        cache     : cache
    });

    // initialize the datastructure with last.fm data
    var dat = {};
    initializeDatastructure(lastfm, user, dat); // no new calls after this, only nested.
});

/**
 * Create a datastructure with last.fm data.
 * Each artist from the active user's top artists
 * as well as from his/her neighbours is used a key. For each key
 * the corresponding users are added.
 * 
 * @param   lastfm  LastFm object
 * @param   user    the active user
 * @param   dat     an object (datastructure) to be initialized with last.fm data.
 */
function initializeDatastructure(lastfm, user, dat) {
    /**
     * info :    get the active user's top artists
     * api  :    http://www.last.fm/api/show/user.getTopArtists
     */
    lastfm.user.getTopArtists({
        user: user,
        limit: 20
    },

    {
        success: function(data) {

            // for each key <artist> add the active user to the list of related users
            for (var i = 0; i < data.topartists.artist.length; i++) {
                if (dat[data.topartists.artist[i].name] == null)
                    dat[data.topartists.artist[i].name] = new Array();
                dat[data.topartists.artist[i].name].push(user);
            }

            getNeighboursDat(lastfm, user, dat);
        },
        error: function(code, message) {
            /* Show error message. */
            alert(code + " " + message);
        }
    }
    );
}


/**
 * Add neighbour data to the given datastructure for a given user.
 *
 * @param   lastfm  LastFm object
 * @param   user    the user to get top artits from.
 * @param   dat     the datastructure
 */
function getNeighboursDat(lastfm, user, dat) {
    /**
     * info :    get the active user's neighbours
     * api  :    http://www.last.fm/api/show/user.getNeighbours
     */
    lastfm.user.getNeighbours(
    {
        user: user,
        limit: 10
    },

    {
        success: function(data) {

            // for each neighbour get his/her top artists
            var offset = 0;
            var size = data.neighbours.user.length;
            getTopArtistsNeighbour(lastfm, data, offset, size, dat);
        },
        error: function(code, message) {
            /* Show error message. */
            alert(code + " " + message);
        }
    }
    );
}

/**
 * Add top artist data to the given datastructure for a given user.
 * 
 * @param   lastfm  LastFm object
 * @param   ndata   the neighbours of the active user.
 * @param   index   the index of the neighbour to get top artists from.
 * @param   size    the size of the data.
 * @param   dat     the datastructure to initialize.
 */
function getTopArtistsNeighbour(lastfm, ndata, index, size, dat) {
    // if for each neighbour the list has been initialized, return.
    if (index == size) {
        // build the visualization
        //buildVisualization(dat);
        createTableFromData(dat);
    } else {
        var neighbour = ndata.neighbours.user[index].name;
        /**
         * info :    get the active user's top artists
         * api  :    http://www.last.fm/api/show/user.getTopArtists
         */
        lastfm.user.getTopArtists({
            user: neighbour,
            limit: 20
        },

        {
            success: function(data) {

                // for each key <artist> add the active user to the list of related users
                for (var i = 0; i < data.topartists.artist.length; i++) {
                    if (dat[data.topartists.artist[i].name] == null)
                        dat[data.topartists.artist[i].name] = new Array();
                    dat[data.topartists.artist[i].name].push(neighbour);
                }

                index = index + 1;
                getTopArtistsNeighbour(lastfm, ndata, index, size, dat);
            },
            error: function(code, message) {
                /* Show error message. */
                alert(code + " " + message);
            }
        }
        );
    }
}

/**
 * Creates a table from given last.fm data.
 *
 * @param   dat     the last.fm data to be inserted into a table.
 */
function createTableFromData(dat) {
    var datatext = "";

    for (var key in dat) {
        datatext += "<p>" + key + " - users : <ul>";
        var users = dat[key];
        for (var i = 0; i < users.length; i++) {
            datatext += "<li>" + users[i] + "</li>";
        }
        datatext += "</p></ul>";
    }

    jQuery(datatext).insertAfter('#lastfm-data-simple');
}

/**
 * Creates a visualization with given last.fm data.
 *
 * @param   dat     the last.fm data to be visualized.
 */
function buildVisualization(dat) {
    
}