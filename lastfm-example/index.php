<!--
  Document    : index
  Created on  : 25-nov-2012, 13:49:17
  Version     : 25-nov-2012
  Author      : Joris Schelfaut

  Website     : http://soundsuggest.wordpress.com/
  Source code : https://github.com/JorisSchelfaut/soundsuggest
-->
<?php
/*
 * INCLUDE the following PHP files:
 */
//include_once('');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <title>
            SoundSuggest
        </title>
        <meta name="language" content="english"/>
        <meta name="description" content="SoundSuggest - Thesis KUL - Visualization of music suggestions"/>
        <meta name="keywords" content="soundsuggest visualization of music suggestions" />
        <link rel="shortcut icon" href="data/img/icon.gif" />
        <link rel="stylesheet" type="text/css" href="css/index.css"/>
        <script type="text/javascript" src="js/json/json2.js"></script>
        <script type="text/javascript" src="js/jquery/jquery-1.8.3.js"></script>
        <script type="text/javascript" src="js/lastfm/lastfm.api.md5.js"></script>
        <script type="text/javascript" src="js/lastfm/lastfm.api.cache.js"></script>
        <script type="text/javascript" src="js/lastfm/lastfm.api.js"></script>
        <script type="text/javascript" src="js/d3/d3.v2.js"></script>
        <script type="text/javascript">
            //
            /* Create a cache object */
            var cache = new LastFMCache();

            /* Create a LastFM object */
            var lastfm = new LastFM({
                    apiKey    : '828c109e6a54fffedad5177b194f7107',
                    apiSecret : '7c2f09e6eb84e8a6183c59e0bc574f70',
                    cache     : cache
            });

            /* Load some artist info. */
            lastfm.artist.getInfo({artist: 'Noisedriver'}, {success: function(data){
                    /* Use data. */

                    alert(data.artist.name);

            }, error: function(code, message){
                    /* Show error message. */
                    alert(code + " " + message);
            }});
        </script>
    </head>
    <body id="soundsuggest-main">
        <div id="soundsuggest-container">

            <!-- HEADER -->
            <div id="header">
                <div>
                    <h1 id="soundsuggest-h1">SoundSuggest</h1>
                    <em id="soundsuggest-h1-subtitle">
                        Visualization of Music Suggestions
                    </em>
                </div>
                <h2 id="soundsuggest-h2">Home</h2>
            </div>

            <!-- CONTENT -->
            <div id="soundsuggest-content">
                
            </div>

            <!-- FOOTER -->
            <div id="soundsuggest-footer">
                
            </div>
        </div>
    </body>
</html>
