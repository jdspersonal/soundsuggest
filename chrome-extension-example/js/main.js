/*
 * Part of the SoundSuggest project. For more info consult:
 * http://soundsuggest.wordpress.com/ . Written by
 * Joris Schelfaut.
 */

var user = document.location.toString().split("user/")[1];
var active_user = $('#idBadgerUser').attr('href').split("user/")[1];
var dataset = {};
var matrix = [];
var range = [];
var range_artists = [];
var N = 0;
var limit = 20;
var scaling_factor;
var svg;
var width = 618;
var height = 550;

chrome_getTopArtists = function(data, callback) {
    chrome.extension.sendMessage({
            action  :   'user.gettopartists',
            data    :   data
        },
        callback
    );
};

$(document).ready(function() {
    build();
});

function build() {
    $.Deferred(getTopArtists()).promise();
}

function getTopArtists() {
    chrome_getTopArtists({
        user: user,
        limit: limit
    },
    function(response1) {
        updateDat(response1, user);
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
        console.log("response.topartists.artist[" + i + "] = " + response.data.topartists.artist[i].name);
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
    scaling_factor = N / 2;
    matrix = new Array(N);
    for (var i = 0; i < N; i++) {
        matrix[i] = new Array(N);
    }

    var index1 = 0;
    var index2 = 0;
    for (var key1 in dataset) {
        if (dataset[key1].length == 2) {
            index2 = 0;
            for (var key2 in dataset) {
                if ((dataset[key2].length == 2) && (key1 != key2)) {
                    matrix[index1][index2] = scaling_factor;
                } else if ((dataset[key2].length == 1) && (key1 != key2)) {
                    matrix[index1][index2] = 1;
                } else {
                    matrix[index1][index2] = 0;
                }
                index2++;
            }
        } else if (dataset[key1].length == 1) {
            index2 = 0;
            for (var key2 in dataset) {
                if ((dataset[key2].length == 1) && (key1 != key2) && (dataset[key1][0] == dataset[key2][0])) {
                   matrix[index1][index2] = 1;
                } else {
                    matrix[index1][index2] = 0;
                }
                index2++;
            }
        } else {
            index2 = 0;
            for (var key2 in dataset) {
                matrix[index1][index2] = 0;
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
