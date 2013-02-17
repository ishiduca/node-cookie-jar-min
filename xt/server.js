var http = require('http')
,   url  = require('url')
,   path = require('path')
,   QUnit   = require(path.join( __dirname, '../help'))
,   cookies = require(path.join( __dirname, '../index'))
;

var cookie_json = path.join(__dirname, 'cookie.json');

function key_test (cookieStr, keys, pathname) {
    var res = keys.filter(function (key) {
        return cookieStr.indexOf(key) !== -1;
    });
    equal(res.length, keys.length, pathname +  ' - ' + res.join('; '));
}

var port   = 3000;
var uri    = 'http://localhost:' + port;
var server = http.createServer(function (req, res) {
    var pathname  = url.parse(req.url).pathname;
    var cookieStr = req.headers['cookie'];

    if (! cookieStr) {
        var maxAge = (60 * 10);
        res.setHeader('set-cookie', [
            'key=private; max-age=' + maxAge + '; path=/private'
          , 'key=public; max-age='  + maxAge + '; path=/'
        ]);
    } else {
        test(pathname, function () {
            var cookies = [ 'key=public' ];
            pathname === '/private' && cookies.push('key=private');
            key_test(cookieStr, cookies, pathname);
        });
    }

    res.writeHead(200);
    res.end(pathname);
});

server.listen(port, function () {
    console.log('server start to listen on port "%d"', port);

    var cookie = cookies();
    var req    = http.request(uri);

    req.on('error', onError);
    req.on('response', function (res) {
        res.on('error', onError);
        res.on('end', function () {
            cookie.get(res, req);

            var pathnames = ('/ /private').split(' ');
            var count     = 0;
            pathnames.forEach(function (pathname) {
                var req = http.request(uri + pathname);
                req.on('error', onError);
                req.on('response', function (res) {
                    count++;
                    res.on('error', onError);
                    res.on('end', function () {
                        cookie.get(res, req);

                        if (pathnames.length === count) {
                            server.close();
                            console.log('sever cloesd');
                            process.exit(0);
                        }
                    });
                });
    
                cookie.set(req);
                req.end();
            });
        });
    });

    req.end();
});

function onError (err) { console.error(err) }
