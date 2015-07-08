/* Resources.js
 * This is simple an image loading utility. It eases the process of loading
 * image files so that they can be used within your game. It also includes
 * a simple "caching" layer so it will reuse cached images if you attempt
 * to load the same image multiple times.
 */
(function() {
    var resourceCache = {}; //define resouce cache as an object
    var loading = [];
    var readyCallbacks = [];

    //This function can be called from other places prefixed with 'Resources' (??)
    /* The call call is made from the engine files. The load function accepts
     * an array of strings pointing to image files or a string for a single
     * image. It will then call our private image loading function accordingly. 
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {//check whether the parameter is an array or string
            
            urlOrArr.forEach(function(url) {//loop through the values in the array assigning them as 
                //variable 'url'
                _load(url);//each loop call the private load function (denoted by underscore)
                //the parameter passed to the function is the url string value of the array index
                //held within the 'url' variable
            });
        } else {
            
            _load(urlOrArr);//call the private load function and pass it the string url held in the 
            //urlOrArr valribale that was passed to the container function as a parameter
        }
    }

    //private load function denoted by preceding underscore
    function _load(url) {
        if(resourceCache[url]) {
            /* If this URL has been previously loaded it will exist within
             * our resourceCache array. Just return that image rather
             * re-loading the image.
             */
            return resourceCache[url];
        } else {
            /* This URL has not been previously loaded and is not present
             * within our cache; we'll need to load this image.
             */
            var img = new Image();
            img.onload = function() {
                /* Once our image has properly loaded, add it to our cache
                 * so that we can simply return this image if the developer
                 * attempts to load this file in the future.
                 */
                resourceCache[url] = img;

                /* Once the image is actually loaded and properly cached,
                 * call all of the onReady() callbacks we have defined.
                 */
                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };

            /* Set the initial cache value to false, this will change when
             * the image's onload event handler is called. Finally, point
             * the images src attribute to the passed in URL.
             */
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /* This is used by developer's to grab references to images they know
     * have been previously loaded. If an image is cached, this functions
     * the same as calling load() on that URL.
     */
    function get(url) {
        return resourceCache[url];
    }

    /* This function determines if all of the images that have been requested
     * for loading have in fact been completed loaded.
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false; //if the array object has a property of the but has not indexed it yet
                //then the image is not yet ready - -set as false.
            }
        }
        return ready;//returns either true or false depending on whether the image has loaded
    }

    /* This function will add a function to the callback stack that is called
     * when all requested images are properly loaded.
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }


    //create a Resources object based on the anonymous container function
    //in this resources.js file that can be called from elsewhere (by prefixing the function with 
    //object dot notation (i.e Resources.). Define the functions that are available on the public scope.
    window.Resources = { //Resources object JSON
        load: load, //load function
        get: get,// get function
        onReady: onReady, //onReady function
        isReady: isReady //isready function
    };
})();
