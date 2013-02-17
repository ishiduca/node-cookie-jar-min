var path    = require('path')
,   QUnit   = require(path.join(__dirname, '../help')).QUnit
,   cookies = require(path.join(__dirname, '../index'))
,   data    = { expires: path.join(__dirname, 'data/expires.js') }
;

test('expires', function () {
    var cookie = cookies(data.expires);

    ok(! cookie.cookie_jar['asian.kung-fu.gen']['/isTimeout/']
      ,  'asian.kung-fu.gen /isTimeout/ is not exists'
    );

    ok(  cookie.cookie_jar['asian.kung-fu.gen']['/live/']
      ,  'asian.kung-fu.gen /live/ has cookies'
    );

	test('expires value check', function () {
        var org_cookie_jar = require(data.expires);
        Object.keys(org_cookie_jar['asian.kung-fu.gen']['/live/']).forEach(function (key) {
            ok(  cookie.cookie_jar['asian.kung-fu.gen']['/live/'][key]
              , 'asian.kung-fu.gen /live/ ' + key + ' has cookie'
            );
        });

        Object.keys(org_cookie_jar['asian.kung-fu.gen']['/live/']).forEach(function (key) {
            var org_value = org_cookie_jar['asian.kung-fu.gen']['/live/'][key].value;
            equal( org_value
                ,  cookie.cookie_jar['asian.kung-fu.gen']['/live/'][key].value
                , 'asian.kung-fu.gen /live/ ' + key + ' value: ' + org_value
            );
        });

	});
});
