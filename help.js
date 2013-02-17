var util     = require('util')
,   QUnit    = require('qunitjs')
,   qunitTap = require('qunit-tap').qunitTap
;

qunitTap(QUnit, util.puts);
QUnit.init();
QUnit.config.updateRate = 0;

('test deepEqual equal notDeepEqual notEqual notStrictEqual ok strictEqual throw').split(' ').forEach(function (keyword) {
    global[keyword] = QUnit[keyword];
});

module.exports.QUnit = QUnit;
