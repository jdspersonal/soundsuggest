
/**
 * <b>chrome_getTopArtists</b> :
 * <p>
 * Use chrome_getTopArtists instead of lastfm.user.getTopArtists in extensions.
 * Uses :</br>
 * <pre>chrome.extension.sendMessage(string extensionId, any message)</pre>
 * </p>
 * <p>
 * <em>extensionId ( optional string )</em> :
 * The extension ID of the extension you want to connect to.
 * If omitted, default is your own extension.
 * </p>
 * <p>
 * <em>message ( any )</em>
 * </p>
 * <p>
 * If you specify the <em>responseCallback parameter</em>, it should specify
 * a function that looks like this:
 * <pre>function(any response) {...};</pre>
 * </p>
 * <p>
 * <em>response ( any )</em> :
 * The JSON response object sent by the handler of the message.
 * If an error occurs while connecting to the extension,
 * the callback will be called with no arguments and
 * <pre>chrome.extension.lastError</pre> will be set to the error message.
 * </p>
 * <p>
 * @link <a href="http://developer.chrome.com/extensions/extension.html#method-sendMessage">
 * #method-sendMessage</a>
 * </p>
 * @param  data        data
 * @param  callback    the callback
 */
chrome_getTopArtists = function(data, callback) {
    chrome.extension.sendMessage
    (
        //'@@extension_id',
        {
            action  :   'user.gettopartists',
            data    :   data
        },
        callback
    );
};