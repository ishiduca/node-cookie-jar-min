module.exports = {
    'asian.kung-fu.gen': {
        '/live/': {
            '01': {
                value: 'no max-age and exists expires'
              , expires: expires(10)
            }
          , '02': {
                value: 'exists max-age and no expires'
              , 'max-age': maxAge(10)
            }
          , '03': {
                value: 'exists max-age and exists expires'
              , 'max-age': maxAge(10)
              , expires: expires(-10)
            }
          , '04': {
                value: 'no max-age and no expires'
            }
        }
      , '/isTimeout/': {
            '01': {
                value: 'no max-age and exists expires'
              , expires: expires(-10)
            }
          , '02': {
                value: 'exists max-age and no expires'
              , 'max-age': maxAge(-10)
            }
          , '03': {
                value: 'exists max-age and exists expires'
              , 'max-age': maxAge(-10)
              , expires: expires(10)
            }
        }
    }
};

function now () {
    return Date.now();
}

function expires (min) {
    return (new Date(now() + maxAge(min))).toUTCString();
}

function maxAge (min) {
    return (1000 * 60 * (min || 0));
}
