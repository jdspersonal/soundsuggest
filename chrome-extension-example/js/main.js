/**
 * ABOUT THIS SCRIPT :
 * 
 * <p>
 * This script is part of a Google Chrome Extension. It is a content script
 * (http://developer.chrome.com/extensions/content_scripts.html) of a
 * page_action http://developer.chrome.com/extensions/pageAction.html.
 * For more on chrome extensions visit
 * http://developer.chrome.com/extensions/overview.html .
 * </p>
 * <p>
 * The script gets a Last.fm user that active user is visiting (last.fm/user/*).
 * Then gets the top artists for that user and the top artists for the
 * active user and visualizes similarities in these profiles.
 * </p>
 * <p>
 * The Last.fm API can be found at http://www.last.fm/api.
 * </p>
 * <p>
 * A chord diagram is created based on a matrix:
 * for each row correspodning to an artist, a link
 * is established using the value of each column
 * corresponding to the other artists.
 * </p>
 * <p>
 * This script is based on a JavaScript program
 * by Michael Bostock (http://d3js.org/ and https://github.com/mbostock/d3),
 * which can be found at http://bl.ocks.org/4062006 . For more info on
 * chord diagrams: http://circos.ca/ .
 * </p>
 * 
 * <p>
 * This script is written by Joris Schelfaut. For more info
 * consult http://soundsuggest.wordpress.com/ .
 * </p>
 */

// Getting the user names :
var user        = document.location.toString().split("user/")[1];
var active_user = $('#idBadgerUser').attr('href').split("user/")[1];
var dat         = {};

$(document).ready(function() {
    getTopArtists();
});

function getTopArtists() {
    chrome_getTopArtists(
        {
            user    : user
        },
        function(response) {
            for (var i = 0; i < response.data.topartists.artist.length; i++) {
                console.log("response.topartists.artist[" + i + "] = "
                        + response.data.topartists.artist[i].name);
            }
        });
}
