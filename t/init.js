var path    = require('path')
,   QUnit   = require(path.join(__dirname, '../help')).QUnit
,   cookies = require(path.join(__dirname, '../index'))
,   data    = {
        json:      path.join(__dirname, 'data/cookie.json')
      , js:        path.join(__dirname, 'data/cookie.js')
      , txt:       path.join(__dirname, 'data/set-cookie.dat')
      , no_exists: path.join(__dirname, 'data/set-cookie.json')
      , obj: {
            'www.pics.net': {
                '/': {
                    akg: {
                        value: '君繋ファイブエム'
                    }
                }
            }
        }
    }
;


test('init', function () {
    init();
    init(undefined,      'argument - "undefiend": exists cookie_jar');
    init(null,           'argument - "null": exists cookie_jar');
    init(data.obj,       'argument - "hash object": exists cookie_jar');
    init(data.json,      'argument - ".js file": exists cookie_jar')
    init(data.js,        'argument - ".json file": exists cookie_jar')
    init(data.txt,       'argument - "not (js|json) file": exists cookie_jar')
    init(data.no_exists, 'argument - "no exists file": exists cookie_jar')
});

test('exist value', function () {
    exists_value(data.json, require(data.json));
    exists_value(data.js,   require(data.js));
    exists_value(data.obj,  data.obj);
});

test('link', function () {
    link(data.obj,           'data.obj link ok');
    link(require(data.json), 'require("data.json") link ok');
    link(require(data.js),   'require("data.js") link ok');
});


function init (cookie_jar, mes) {
    var cookie = cookies(cookie_jar);
    ok(cookie.cookie_jar, mes);
}

function exists_value (cookie_jar, _json) {
    var cookie = cookies(cookie_jar)
      , domain, pth, key, c;
    for (domain in _json) {
        for (pth in _json[domain]) {
            for (key in _json[domain][pth]) {
                equal( _json[domain][pth][key].value
                     , cookie.cookie_jar[domain][pth][key].value
                     , cookie.cookie_jar[domain][pth][key].value + ' ok'
                );
            }
        }
    }
}

function link (cookie_jar, mes) {
    var cookie = cookies(cookie_jar);
    equal(cookie.cookie_jar, cookie_jar, mes);
}
