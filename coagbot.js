var fs = require('fs'),
    format = require('./format').format,
    irc_ = require('irc');

var logfile = '/home/clouserw/sandbox/coag.log',
    irc = new irc_.Client('irc.mozilla.org', 'coagbot', {channels: ["#mozpdx"]});

irc.on('message', function(from, to, message) {
    if (message == irc.nick + ': yo') {
        msg = format("{0}: {1}\n", from, Date())
        var log = fs.createWriteStream(logfile, {'flags': 'a'});
        log.end(msg)
        irc.say(to, format('{0}: got it', from));
    }
});
