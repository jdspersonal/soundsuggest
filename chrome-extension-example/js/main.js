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
var user = document.location.toString().split("user/")[1];
var active_user = $('#idBadgerUser').attr('href').split("user/")[1];
var dataset = {};
var matrix = [];
var range = []; // "#000000", "#33585e", "#957244", "#F26223", "#155420"
var range_artists = [];
var N = 0;
var limit = 10;
var html_string = '';
var scaling_factor = 25;

var svg;
var width = 618;
var height = 550;

$(document).ready(function() {
    build();
});

function build() {
    $.Deferred(getTopArtists()).promise();
    $('#recentTracks').append(html_string);
}

function getTopArtists() {

    // Get the top artists for the visited user
    chrome_getTopArtists(
            {
                user: user,
                limit: limit
            },
    function(response1) {
        updateDat(response1, user);

        // Get the artists for the active user
        chrome_getTopArtists(
                {
                    user: active_user,
                    limit: limit
                },
        function(response2, active_user) {
            updateDat(response2, active_user);
            setDIV();
            setRange();
            buildMatrix();
            buildVisualization();
        });
    });
}

function setDIV() {
    $('<div id="soundsuggest">'
            + buildNavigation()
            + '<div id="soundsuggest-chart"></div>'
            + '</div>').insertBefore('#recentTracks');
}


function buildNavigation() {
    var navg = '<div style="width: 618px;">';
    
    navg += '   <ul id="#navg-ul">';
    for (var key in dataset) {
        navg += '   <li id="#navg-' + key + '" style="display: inline;">' + key + '</li>';
    }
    navg += '   <ul>';
    navg += '</div>';
    return navg;
}


function updateDat(response, usr) {
    console.log('user : ' + usr);
    for (var i = 0; i < response.data.topartists.artist.length; i++) {
        // Log output : see console in google chrome.
        console.log("response.topartists.artist[" + i + "] = "
                + response.data.topartists.artist[i].name);
        if (dataset[response.data.topartists.artist[i].name] == null)
            dataset[response.data.topartists.artist[i].name] = new Array();
        dataset[response.data.topartists.artist[i].name].push(usr);
    }
}

function setRange() {
    for (var key in dataset) {
        range_artists.push(key);
    }

    for (var key in dataset) {

        var R = Math.floor((Math.random() * 8) + 1);
        var G = Math.floor((Math.random() * 8) + 1);
        var B = Math.floor((Math.random() * 8) + 1);

        range.push('#' + R + '' + G + '' + B);
    }
}

function buildMatrix() {

    N = Object.keys(dataset).length;

    // Initialize an NxN matrix : the size is the number of different artists N
    matrix = new Array(N);
    for (var i = 0; i < N; i++) {
        matrix[i] = new Array(N);
    }

    // all elements are greater or equal to 1, except on the diagonal they are 0
    for (var i = 0; i < N; i++) {
        for (var j = 0; j < N; j++) {
            if (i != j) {
                matrix[i][j] = 1;
            } else {
                matrix[i][j] = 0;
            }
        }
    }

    // Artists i and j that are present in both profiles will
    // result in matrix[i][j] == 2
    var index1 = 0;
    for (var key1 in dataset) {
        console.log("+checking key == " + key1);
        // Artists that are present in both profiles.
        if (dataset[key1].length == 2) {
            var index2 = 0;
            for (var key2 in dataset) {
                console.log("+----checking key == " + key2);
                // Artists that are present in both profiles.
                if ((dataset[key2].length == 2) && (key1 != key2)) {
                    console.log("|    MATCH : " + key1 + ' and ' + key2);
                    matrix[index1][index2] = scaling_factor;
                    console.log(range[index1]);
                    console.log(range[index2]);
                    //$('#navg-' + key1).css('background-color', range[index1]);
                    //$('#navg-' + key2).css('background-color', range[index2]);
                }
                index2++;
            }
        }
        index1++;
    }
}

function showMatrix() {
    for (var i = 0; i < N; i++) {
        var out = '';
        for (var j = 0; j < N; j++) {
            out += matrix[i][j] + ' ';
        }
        console.log('[ ' + out + ']');
    }
}

function buildVisualization() {
    
    svg = d3.select("#soundsuggest-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var chord = d3.layout.chord()
            .padding(.05)
            .sortSubgroups(d3.descending)
            .matrix(matrix);

    var fill = d3.scale.ordinal()
            .domain(d3.range(range.length))
            .range(range);


    var innerRadius = Math.min(width, height) * .41;
    var outerRadius = innerRadius * 1.1;

    svg.append("g")
            .selectAll("path")
            .data(chord.groups)
            .enter().append("path")
            .style("fill", function(d) {
                return fill(d.index);
            })
            .style("stroke", function(d) {
                return fill(d.index);
            })
            .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
            .on("mouseover", fade(.1))
            .on("mouseout", fade(1));

    svg.append("g")
            .attr("class", "chord")
            .selectAll("path")
            .data(chord.chords)
            .enter().append("path")
            .style("fill", function(d) {
                return fill(d.target.index);
            })
            .attr("d", d3.svg.chord().radius(innerRadius))
            .style("opacity", 1);
}

function fade(opacity) {
    return function(g, i) {
        svg.selectAll("g.chord path")
                .filter(function(d) {
                    return d.source.index != i && d.target.index != i;
                })
                .transition()
                .style("opacity", opacity);
    };
}
