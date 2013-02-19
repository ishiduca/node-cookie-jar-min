var util   = require('util')
,   fs     = require('fs')
,   moment = require('moment')
;

module.exports = function (jar) {
    return new Cookies(jar);
};
module.exports.Cookies = Cookies;

function Cookies (jar) {
    this.init(jar);
}

var cp = Cookies.prototype;

cp.clone = function () {
    return new Cookies(this.dump());
};
cp.dump = function () {
    var now = Date.now();
    var cookie_jar  = {};
    var _cookie_jar = this.cookie_jar;

    _scan(_cookie_jar, function (domain, path, key) {
        var _cookie = _cookie_jar[domain][path][key];
        if (_isTimeout(_cookie._expires, now)) {
            return _remove(_cookie_jar, domain, path, key);
        }

        var _option = Object.keys(_cookie).reduce(function (_opt,_key) {
            if (_key !== 'value') _opt[_key] = _cookie[_key];
            return _opt;
        }, {});
        _add(cookie_jar, domain, path, key, _cookie.value, _option);
    });

    return cookie_jar;
};
cp.init = function (jar) {
    if ('string' === typeof jar) return this.load(jar);

    if ('object' === typeof jar && jar !== null) this.cookie_jar = jar;
    _grepExpire(this.cookie_jar);
    if (! this.cookie_jar) this.cookie_jar = jar = {};
};
cp.load = function (filePath) {
    this.cookie_jar = _load(filePath);
    _grepExpire(this.cookie_jar);

    if (! this.cookie_jar) this.cookie_jar = {};
};
cp.save = function (filePath, onSave) {
    if ('function' !== onSave) {
        onSave = function (err) { err && console.error(err) };
    }

    fs.writeFile(filePath, this.dump(), 'utf8', onSave);
};
cp.parse = function (setCookies, _domain) {
    if (! setCookies) return;
    if ('string' === typeof setCookies) setCookies = [ setCookies ];
    if (! util.isArray(setCookies)) return;

    var now        = Date.now();
    var cookie_jar = this.cookie_jar;

    setCookies.forEach(function (setCookie) {
        var buf = setCookie.split(';').map(function (pair) {
            return pair.trim().split('=');
        });

        var pair = buf.shift();
        var key = decodeURI(pair[0]);
        var val = decodeURI(pair[1]);

        var option = buf.reduce(function (_option, kv) {
            _option[kv[0].toLowerCase()] = kv[1] || '';
            return _option;
        }, {});


        var path   = option.path   || '/';
        var domain = option.domain || _domain;

        if (! domain) {
            return console.error(new Error('"domain" not found'));
        }

        if (option.domain && _domain) {
            if (! _domainTest(option.domain, _domain)) {
                return console.error(new Error('domain test error: domain "'
                                         + option.domain  + '", _domain "'
                                         + _domain + '"'));
            }
        }

        if (_domain && ! option.domain) option._domain = 'strict';

        delete option.path;
        delete option.domain;


        var _expires;
        var maxAge  = option['max-age']; delete option['max-age'];
        var expires = option.expires;    delete option.expires;

        if (maxAge)                _expires = Number(maxAge) + now;
        if (expires && ! _expires) _expires = Number(moment(expires));

        if (_isTimeout(_expires, now)) return;

        if (_expires) option._expires = _expires;

        _add(cookie_jar, domain, path, key, val, option);
    });
};
cp.extract = function (domain, path) {
    path || (path = '/');

    var cookie_jar = this.cookie_jar;
    var now   = Date.now();
    var stock = {};

    Object.keys(cookie_jar).sort(_sort).forEach(function (_domain) {
        if (! _domainTest(_domain, domain)) return;
        Object.keys(cookie_jar[_domain]).forEach(function (_path) {
            if (! _pathTest(path, _path)) return;
            Object.keys(cookie_jar[_domain][_path]).forEach(function (key) {
                var cookie = cookie_jar[_domain][_path][key];
                if (_isTimeout(cookie._expires, now)) {
                    return _remove(cookie_jar, _domain, _path, key);
                }

                stock[key] || (stock[key] = {});
                stock[key][_path] || (stock[key][_path] = {});

                if ("strict" === stock[key][_path]._domain) return;

                stock[key][_path].value = cookie.value;

                if ("strict" === cookie._domain && _domain === domain)
                    stock[key][_path]._domain = "strict";
            });
        });
    });

    var cookies = [];
    Object.keys(stock).forEach(function (key) {
        Object.keys(stock[key]).forEach(function (_path) {
            cookies.push([
                encodeURI(key), encodeURI(stock[key][_path].value)
            ].join('='));
        });
    });

    return cookies.join('; ');
};
cp.set = function (req) {
    if (req && 'function' === typeof req.getHeader) {
        var cookie = this.extract(req.getHeader('host'), req.path);
        cookie && req.setHeader('cookie', cookie);
    }
};
cp.get = function (res, req) {
    if (res && res.headers && res.headers['set-cookie']) {
        var setCookies = res.headers['set-cookie'];
        if ('string' === typeof setCookies) setCookies = [ setCookies ];

        var domain;
        if (req && 'function' === typeof req.getHeader)
            domain = req.getHeader('host');

        this.parse(setCookies, domain);
    }
};

//

function _load (filePath) {
    var cookie_jar; try {
        cookie_jar = require(filePath);
    } catch (e) {
        console.error(e);
    }
    return cookie_jar;
}
function _add (cookie_jar, domain, path, key, value, _option) {
    _option || (_option = {});
    _option.value = value;

    cookie_jar[domain]       || (cookie_jar[domain]       = {});
    cookie_jar[domain][path] || (cookie_jar[domain][path] = {});
    cookie_jar[domain][path][key] = _option;
}
function _remove (cookie_jar, domain, path, key) {
    delete cookie_jar[domain][path][key];

    if (Object.keys(cookie_jar[domain][path]).length === 0)
        delete cookie_jar[domain][path];

    if (Object.keys(cookie_jar[domain]).length === 0)
        delete cookie_jar[domain];
}

function _isTimeout (expires, now) {
    return 'number' === typeof expires && now > expires;
}
function _grepExpire (cookie_jar) {
    if (! cookie_jar) return;

    var now = Date.now();
    _scan(cookie_jar, function (domain, path, key) {
        var cookie = cookie_jar[domain][path][key];
        if (_isTimeout(cookie._expires, now))
            _remove(cookie_jar, domain, path, key);
    });
}
function _scan (cookie_jar, cb) {
    var domains = Object.keys(cookie_jar).sort(_sort);
    var i = 0, len = domains.length, domain, path, key;
    for (; i < len; i++) {
        domain = domains[i];
        for (path in cookie_jar[domain]) {
            for (key in cookie_jar[domain][path]) {
                cb(domain, path, key);
            }
        }
    }
}
function _sort (a, b) {
    var len = a.length - b.length;
    return (len === 0) ? 0 : (len > 0) ? 1 : -1;
}

function _domainTest (domain, _domain) {
    if (domain.slice(0, 1) === '.' && domain.slice(1) === _domain) return true;
    return domain === _domain.slice(_domain.length - domain.length);

}
function _pathTest (reqestPath, inJarPath) {
    return inJarPath === reqestPath.slice(0, inJarPath.length);
}
