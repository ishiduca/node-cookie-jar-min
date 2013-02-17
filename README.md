# cookie-jar-min

# Synopsis

````javascript
var http    = require('http');
var Cookies = require('cookie-jar-min').Cookies;

var cookieJarJsonFile = './cookie_jar.json';
var cookie = new Cookies( cookieJarJsonFile );

var req = http.request('http://ex.amp.le');

req.on('response', function (res) {
    res.on('error', function (err) {
        console.error(err);
    });
    ...
    res.on('end', function () {
        ...
        cookie.get(res, req);
        cookie.save( cookieJarJsonFile, function (err) {
            err && consolr.error(err);
        });
    });

    if (res.statusCode !== 200) {
        var err = res.statusCode.toString() + ': '
                + http.STATUS_CODES[ res.statusCode.toString() ];
        return res.emit('error', new Error(err));
    }
});

cookie.set(req);
req.end();
````

# API

## cookies

Functions on the module you get from `require('cookie-jar-min')`.

### load( path_to_cookie_jar.json )

load cookie_jar from __path\_to\_cookie\_jar\.json__


### save( path\_to\_cookie\_jar.json )

save cookie\_jar(encoded JSON) to __path\_to\_cookie\_jar\.json__ 


### get( httpClientResponse, httpClientRequest )



### set( httpClientRequest )


### clone()


### parse( httpClientResponse_headers['set-cookie'], domain )

````javascript
cookie.parse(response.setHeader('set-cookie'), '.example.com');
````

### extract(example, path )

````javascript
var cookieStr = cookie.extract('.example.com', '/');
request.setHeader('cookie', cookieStr);
````

### add( domain, path, key, value, option )


### remove( domain, path, key )

