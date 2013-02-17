var path    = require('path')
,   cookies = require(path.join( __dirname, '../index'))
,   QUnit   = require(path.join( __dirname, '../help')).QUnit
,   cookie_json = path.join( __dirname, 'data/save.json')
;

var cookie = cookies({
    '.test.js.on': {
        '/': {
            'key': {
                value: 'val'
            }
        }
    }
});

cookie.save(cookie_json, function (err) {
    err ? console.error(err)
        : console.log('save ok - %s', cookie_json)
    ;

    test('save', function () {
        ok(! err);
    });
});
