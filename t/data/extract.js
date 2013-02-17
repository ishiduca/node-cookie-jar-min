module.exports = {
    'friendfeed.com': {
        '/': {
            'key_0': {
                value: 'friendfeed.com(strict) / key_0 expiresed'
              , 'max-age': maxAge(-10)
              , _domain: "strict"
            }
          , 'key_1': {
                value: 'friendfeed.com(strict) / key_1'
              , expires: expires(10)
              , _domain: "strict"
            }
          , 'key_2': {
                value: 'friendfeed.com(strict) / key_2'
              , "max-age": maxAge(10)
              , _domain: "strict"
            }
          , 'key:friendfeed.com': {
                value: 'friendfeed.com(strict) / key:friendfeed.com'
              , _domain: "strict"
            }
        }
      , '/private': {
            'key_0': {
                value: 'friendfeed.com(strict) /private key_0 expiresed'
              , 'max-age': maxAge(-10)
              , _domain: "strict"
            }
          , 'key_1': {
                value: 'friendfeed.com(strict) /private key_1'
              , expires: expires(10)
              , _domain: "strict"
            }
          , 'key_2': {
                value: 'friendfeed.com(strict) /private key_2'
              , "max-age": maxAge(10)
              , _domain: "strict"
            }
          , 'key:friendfeed.com': {
                value: 'friendfeed.com(strict) /private key:friendfeed.com'
              , _domain: "strict"
            }
        }
    }
  , '.friendfeed.com': {
        '/': {
            'key_0': {
                value: '.friendfeed.com / key_0 expiresed'
              , 'max-age': maxAge(-10)
            }
          , 'key_1': {
                value: '.friendfeed.com / key_1'
              , expires: expires(10)
            }
          , 'key_2': {
                value: '.friendfeed.com / key_2'
              , "max-age": maxAge(10)
            }
          , 'key:.friendfeed.com': {
                value: '.friendfeed.com / key:.friendfeed.com'
            }
        }
      , '/private': {
            'key_0': {
                value: '.friendfeed.com /private key_0 expiresed'
              , 'max-age': maxAge(-10)
            }
          , 'key_1': {
                value: '.friendfeed.com /private key_1'
              , expires: expires(10)
            }
          , 'key_2': {
                value: '.friendfeed.com /private key_2'
              , "max-age": maxAge(10)
            }
          , 'key:.friendfeed.com': {
                value: '.friendfeed.com /private key:.friendfeed.com'
            }
        }
    }
  , 'api.friendfeed.com': {
        '/': {
            'key_0': {
                value: 'api.friendfeed.com / key_0 expiresed'
              , 'max-age': maxAge(-10)
            }
          , 'key_1': {
                value: 'api.friendfeed.com / key_1'
              , expires: expires(10)
            }
          , 'key_2': {
                value: 'api.friendfeed.com / key_2'
              , "max-age": maxAge(10)
            }
          , 'key:api.friendfeed.com': {
                value: 'api.friendfeed.com / key:api.friendfeed.com'
            }
        }
      , '/private': {
            'key_0': {
                value: 'api.friendfeed.com /private key_0 expiresed'
              , 'max-age': maxAge(-10)
            }
          , 'key_1': {
                value: 'api.friendfeed.com /private key_1'
              , expires: expires(10)
            }
          , 'key_2': {
                value: 'api.friendfeed.com /private key_2'
              , "max-age": maxAge(10)
            }
          , 'key:api.friendfeed.com': {
                value: 'api.friendfeed.com /private key:api.friendfeed.com'
            }
        }

    }
};

function maxAge (min) {
    return (1000 * 60 * min || 5);
}

function expires (min) {
    return (new Date(Date.now() + (maxAge(min)))).toUTCString();
}
