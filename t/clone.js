var path    = require('path')
,   QUnit   = require(path.join( __dirname, '../help')).QUnit
,   cookies = require(path.join( __dirname, '../index'))
,   data    = {
        json: path.join(__dirname, 'data/cookie.json')
      , js:   path.join(__dirname, 'data/cookie.js')
    }
;

//dump and clone

test('clone(dump) exists cookie', function () {
    exists_cookie(data.json);
    exists_cookie(data.js);
});

test('clone(dump) no link', function () {
    no_link(data.json);
    no_link(data.js);
});


function exists_cookie (cookie_jar) {
    var cookie = cookies(cookie_jar);
    var clone  = cookie.clone();

    ok(clone.cookie_jar);
}

function no_link (cookie_jar) {
    var cookie = cookies(cookie_jar);
    var clone  = cookie.clone();

    deepEqual(clone.cookie_jar, cookie.cookie_jar, "deepEqual ok");
    notEqual( clone.cookie_jar, cookie.cookie_jar, "notEqual  ok");
}

