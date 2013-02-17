var path       = require('path')
,   fs         = require('fs')
,   QUnit      = require(path.join(__dirname, '../help')).QUnit
,   cookies    = require(path.join(__dirname, '../index'))
,   cookie_jar = path.join(__dirname, 'data/extract')
;


test('extract', function () {
    var cookie = cookies(cookie_jar);

    extract(cookie, 'friendfeed.com', '/', [
        'key_1=' + encodeURI('friendfeed.com(strict) / key_1')
      , 'key_2=' + encodeURI('friendfeed.com(strict) / key_2')
      , 'key:friendfeed.com=' + encodeURI('friendfeed.com(strict) / key:friendfeed.com')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com / key:.friendfeed.com')
    ]);
    extract(cookie, 'friendfeed.com', '/private', [
        'key_1=' + encodeURI('friendfeed.com(strict) / key_1')
      , 'key_2=' + encodeURI('friendfeed.com(strict) / key_2')
      , 'key:friendfeed.com=' + encodeURI('friendfeed.com(strict) / key:friendfeed.com')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com / key:.friendfeed.com')
      , 'key_1=' + encodeURI('friendfeed.com(strict) /private key_1')
      , 'key_2=' + encodeURI('friendfeed.com(strict) /private key_2')
      , 'key:friendfeed.com=' + encodeURI('friendfeed.com(strict) /private key:friendfeed.com')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com /private key:.friendfeed.com')
    ]);

    extract(cookie, 'api.friendfeed.com', '/', [
        'key_1=' + encodeURI('api.friendfeed.com / key_1')
      , 'key_2=' + encodeURI('api.friendfeed.com / key_2')
      , 'key:api.friendfeed.com=' + encodeURI('api.friendfeed.com / key:api.friendfeed.com')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com / key:.friendfeed.com')
    ]);
    extract(cookie, 'api.friendfeed.com', '/private', [
        'key_1=' + encodeURI('api.friendfeed.com / key_1')
      , 'key_2=' + encodeURI('api.friendfeed.com / key_2')
      , 'key:api.friendfeed.com=' + encodeURI('api.friendfeed.com / key:api.friendfeed.com')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com / key:.friendfeed.com')
      , 'key_1=' + encodeURI('api.friendfeed.com /private key_1')
      , 'key_2=' + encodeURI('api.friendfeed.com /private key_2')
      , 'key:api.friendfeed.com=' + encodeURI('api.friendfeed.com /private key:api.friendfeed.com')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com /private key:.friendfeed.com')
    ]);

    extract(cookie, 'img.friendfeed.com', '/', [
        'key_1=' + encodeURI('.friendfeed.com / key_1')
      , 'key_2=' + encodeURI('.friendfeed.com / key_2')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com / key:.friendfeed.com')
    ]);
    extract(cookie, 'img.friendfeed.com', '/private', [
        'key_1=' + encodeURI('.friendfeed.com / key_1')
      , 'key_2=' + encodeURI('.friendfeed.com / key_2')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com / key:.friendfeed.com')
      , 'key_1=' + encodeURI('.friendfeed.com /private key_1')
      , 'key_2=' + encodeURI('.friendfeed.com /private key_2')
      , 'key:.friendfeed.com=' + encodeURI('.friendfeed.com /private key:.friendfeed.com')
    ]);
});

function extract(cookie, domain, pth, results) {
    var res = cookie.extract(domain, pth);
    var success = [];
    results.forEach(function (result) {
        if (res.indexOf(result) !== -1) success.push(true);
    });

    equal( results.length, success.length, res );
}
