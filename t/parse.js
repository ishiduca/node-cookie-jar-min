var path    = require('path')
,   fs      = require('fs')
,   QUnit   = require(path.join(__dirname, '../help')).QUnit
,   cookies = require(path.join(__dirname, '../index'))
;
var setCookieDat = path.join(__dirname, 'data/set-cookie.dat');
var setCookies = fs.readFileSync(setCookieDat, 'utf8').split('\n')

    .filter(function (str) { return (str) ? true : false })
    .map(   function (str) { return str.split('\t')      })
;


test('parse cookie', function () {
    var cookie = cookies();

    setCookies.forEach(function (args) {
        cookie.parse([ args[0] ], args[1]);
    });

    ok(! cookie.cookie_jar['.goods.double.net']['/']._cookie
      ,  ".goods.double.net / _cookie is timeouted.");

    parse_cookie(cookie, '.goods.double.net', '/', 'adrt_', 'NO_DATA');
    parse_cookie(cookie, '.picts.net','/', 'PHPSESSID', 'ead5ed02b87c6cbac1124f15aa68a18f');
    parse_cookie(cookie, '.picts.net','/', 'p_ab_id', '8');
    parse_cookie(cookie, 'serve-food.jp','/', 'OX_pd', '7182ac20-af6b-11e1-8f8e-842b2b080a35.1360649801');
    parse_cookie(cookie, 'www.kiss-kiss.com','/', 'kiss-kiss_flag', 'kiss-kiss.com');
    parse_cookie(cookie, '.friendfeed.com','/', 'AT', '14567708793909071675_1360650535');
    parse_cookie(cookie, 'www.hoge-shop.ne.jp','/', 'USID', 'a8mf2l3231cnaseda53tk97gh8nc7aae');

    ok(! cookie.cookie_jar['.angel.com']
      ,  ".angel.com could not regist. host is different domain");
    ok(! cookie.cookie_jar['www.evil.com']
      ,  "www.evil.com could not regist. host is different domain");

    test('has a _domain strict', function () {
        has_domain_strict(cookie, 'serve-food.jp', '/', 'OX_pd');
        has_domain_strict(cookie, 'www.kiss-kiss.com', '/', 'kiss-kiss_flag');
        has_domain_strict(cookie, 'www.hoge-shop.ne.jp', '/', 'USID');
    });
});

function parse_cookie (cookie, domain, pth, key, val) {
    var cookie_val = cookie.cookie_jar[domain][pth][key].value;
    var mes = [ domain, pth, key ].join(' ') + ' => ' + val;
    equal( cookie_val, val, mes);
}

function has_domain_strict (cookie, domain, pth, key) {
    var _domain_strict = cookie.cookie_jar[domain][pth][key]._domain;
    var mes = [ domain, pth, key ].join(' ') + ':  "_domain" is "strict"';
    equal('strict', _domain_strict, mes);
}
