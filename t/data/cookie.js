function expires (min) {
    return (new Date(Date.now() + (1000 * 60 * (min || 1)))).toUTCString();
}

var min = 5;
module.exports = {
    '.kung-fu.generation': {
        '/': {
            "01": {
                value: "フラッシュバック"
              , expires: expires(min)
            }
          , "02": {
                value: "未来の破片"
              , expires: expires(min += 5)
            }
          , "03": {
                value: "電波塔"
              , expires: expires(min += 5)
            }
          , "04": {
                value: "UNDERSTAND"
              , expires: expires(min += 5)
            }
          , "05": {
                value: "夏の日、残像"
              , expires: expires(min += 5)
            }
          , "06": {
                value: "無限グライダー"
              , expires: expires(min += 5)
            }
          , "07": {
                value: "その訳を"
              , expires: expires(min += 5)
            }
          , "08": {
                value: "N.G.S"
              , expires: expires(min += 5)
            }
          , "09": {
                value: "自閉探索"
              , expires: expires(min += 5)
            }
          , "10": {
                value: "E"
              , expires: expires(min += 5)
            }
          , "11": {
                value: "君という花"
              , expires: expires(min += 5)
            }
          , "12": {
                value: "ノーネーム"
              , expires: expires(min += 5)
            }
        }
    }
};
