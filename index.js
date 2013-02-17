var qs     = require('querystring')
,   util   = require('util')
,   fs     = require('fs')
,   moment = require('moment')
;
function Cookies (cookie_jar) {
    this.init(cookie_jar);
}


module.exports = function (cookie_jar) {
    return new Cookies(cookie_jar);
};
module.exports.Cookies = Cookies;


var cp = Cookies.prototype;

cp.clone = function () {
    return new Cookies(this.dump());
};
cp.init = function (cookie_jar) {
    'object'   === typeof cookie_jar &&
    cookie_jar !== null              &&
        (this.cookie_jar = _filterExpires(cookie_jar));

    'string' === typeof cookie_jar &&
        this.load(cookie_jar);

    this.cookie_jar ||
        (this.cookie_jar = cookie_jar = {});

    return this;
};
cp.dump = function () {
    var that       = this;
    var cookie_jar = {};
    var now        = Date.now();
    _scan(this.cookie_jar, function (domain, path, key) {
        if (isTimeout(that.cookie_jar[domain][path][key]._expires, now)) {
            return _remove(that.cookie_jar, domain, path, key);
        }

        cookie_jar[domain]       || (cookie_jar[domain] = {});
        cookie_jar[domain][path] || (cookie_jar[domain][path] = {});
        cookie_jar[domain][path][key]
          = Object.keys(that.cookie_jar[domain][path][key])
            .reduce(function (_jar, keyname) {
                _jar[keyname] = that.cookie_jar[domain][path][key][keyname];
                return _jar;
        }, {});
    });
    return cookie_jar;
};
cp.remove = function (domain, path, key) {
    _remove(this.cookie_jar, domain, path, key)
};
cp.load = function (cookie_jar_file) {
    var cookie_jar; try {
        cookie_jar = require(cookie_jar_file);
    } catch (e) {
        console.error(e);
    }

    cookie_jar && (this.cookie_jar = _filterExpires(cookie_jar));
};
cp.save = function (cookie_jar_file, onWriteFile) {
    'function' !== typeof onWriteFile && (onWriteFile = function (err) {
        if (err) console.error(err);
    });

    var json = JSON.stringify(this.dump(), null, 4);
    fs.writeFile(cookie_jar_file, json, 'utf8', onWriteFile);
};
cp.extract = function (domain, path) {
    return _extract(this.cookie_jar, domain, path);
};
cp.parse = function (setCookies, domain) {
    _parse(this.cookie_jar, setCookies, domain);
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


function _setCookieDomainIsDifferentFromHost (setCookieDomain, host) {
    if ( setCookieDomain.slice(0, 1) === '.'
      && setCookieDomain.slice(1)    === host) return false;
    return setCookieDomain !== host.slice(host.length - setCookieDomain.length);
    ;
}
function _parse (cookie_jar, setCookies, domain) {
    if (setCookies && 'string' === typeof setCookies)
        setCookies = [ setCookies ];

    if (! util.isArray(setCookies)) return;

    var now = Date.now();
    setCookies.forEach(function (str) {
        var p = str.indexOf(';'); if (p === -1) p = str.length;
        var pair = qs.parse(str.slice(0, p).trim());
        var option = str.slice(p + 1).split(';').reduce(function (opt, p) {
            var buf = p.trim().split('=');
            var key = buf[0].toLowerCase();
            var val = buf[1] || '';

            opt[key] = val;
            return opt;
        }, {});

        if ( option.domain && domain
          && _setCookieDomainIsDifferentFromHost(option.domain, domain)) {
            return console.error(
                new Error('domain error: "' +
                    option.domain + '" not match "' + domain + '"'));
        }

        var expires = option.expires;    delete option.expires;
        var maxAge  = option['max-age']; delete option['max-age'];
        var path    = option.path;       delete option.path;
        var _domain = option.domain || domain;

        if (! option.domain) option._domain = 'strict';
        delete option.domain;

        if (! _domain) {
            return console.error('"domain" not found');
        }

        var _expires = maxAge  ? Number(maxAge) + now    :
                       expires ? Number(moment(expires)) : undefined;

        if (isTimeout(_expires, now)) {
            return ;//_remove(cookie_jar, _domain, path, key);
        }

        if (_expires) option._expires = _expires;

        var key = Object.keys(pair)[0];
        var val = pair[key];

        _add(cookie_jar, _domain, path, key, val, option);
    });
}
function _scan (cookie_jar, cb) {
    var domains = Object.keys(cookie_jar).sort(_sort)
      , i = 0, len = domains.length
      , domain, path, key;
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
    return (len === 0) ? 0 :
           (len > 0)   ? 1 : -1;
}
function _filterExpires (cookie_jar) {
    var now = Date.now();
    _scan(cookie_jar, function (domain, path, key) {
        var expires = cookie_jar[domain][path][key].expires;
        var maxAge  = cookie_jar[domain][path][key]['max-age'];
        delete cookie_jar[domain][path][key].expires;
        delete cookie_jar[domain][path][key]['max-age'];
        var _expires = maxAge  ? Number(maxAge) + now    :
                       expires ? Number(moment(expires)) : undefined;

        if (_expires) {
            isTimeout(_expires, now)
                ? (_remove(cookie_jar, domain, path, key))
                : (cookie_jar[domain][path][key]._expires = _expires);
        }
    });
    return cookie_jar;
}
function _add (cookie_jar, domain, path, key, value, option) {
    option || (option = {});
    option.value = value;
    cookie_jar[domain]       || (cookie_jar[domain]       = {});
    cookie_jar[domain][path] || (cookie_jar[domain][path] = {});

    if ( ! cookie_jar[domain][path][key]
      || 'strict' === cookie_jar[domain][path][key]._domain
    ) {
        cookie_jar[domain][path][key] = option;
    }

    return cookie_jar;
}
function _remove (cookie_jar, domain, path, key) {
    if (cookie_jar[domain]) {
        if (cookie_jar[domain][path]) {
            delete cookie_jar[domain][path][key];
            if (Object.keys(cookie_jar[domain][path]).length === 0)
                delete cookie_jar[domain][path];
        }
        if (Object.keys(cookie_jar[domain]).length === 0)
            delete cookie_jar[domain];
    }
    return cookie_jar;
}
function _extract (cookie_jar, domain, path) {
    path || (path = '/');
    var now = Date.now();
    var keyStock = {};
    Object.keys(cookie_jar).sort(_sort).forEach(function (_domain) {
        if (! _testDomain(domain, _domain)) return;
        Object.keys(cookie_jar[_domain]).forEach(function (_path) {
            if (! _testPath(path, _path)) return;
            Object.keys(cookie_jar[_domain][_path]).forEach(function (key) {
                if (isTimeout(cookie_jar[_domain][_path][key]._expires, now))
                    return _remove(cookie_jar, _domain, _path, key);

                keyStock[key]        || (keyStock[key] = {});
                keyStock[key][_path] || (keyStock[key][_path] = {});

                if ( "strict" === keyStock[key][_path]._domain) return;

                if ( "strict" === cookie_jar[_domain][_path][key]._domain
                  && _domain === domain) {
                    keyStock[key][_path].value   = cookie_jar[_domain][_path][key].value;
                    keyStock[key][_path]._domain = "strict";
                    return;
                }

                keyStock[key][_path].value = cookie_jar[_domain][_path][key].value;
            });
        });
    });
    var cookies = [];
    Object.keys(keyStock).forEach(function (key) {
        Object.keys(keyStock[key]).forEach(function (_path) {
            cookies.push([
                encodeURI(key)
              , encodeURI(keyStock[key][_path].value)
            ].join('='));
        });
    });

    return cookies.join('; ');
}
function _testDomain (requestDomain, _domain) {
    if (_domain.slice(0,1) === '.' && _domain.slice(1) === requestDomain) return true;
    var _testDomainStr = requestDomain.slice(requestDomain.length - _domain.length);
    return _domain === _testDomainStr;
}
function _testPath (requestPath, _path) {
    return _path === requestPath.slice(0, _path.length);
}

function isTimeout (expires, now) {
    return expires && now > expires;
}

