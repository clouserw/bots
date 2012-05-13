var sys = require('sys'),
    irc_ = require('irc'),
    request = require('request'),
    format = require('./format').format;


var amo = '#amo',
    amobots = '#amo-bots',
    NICK = 'amobot'
    irc = new irc_.Client('irc.mozilla.org', NICK,
                          {channels: [amo, amobots]}),
    repo = 'https://github.com/mozilla/zamboni',
    revURL = 'https://addons-dev.allizom.org/media/git-rev.txt',
    branchesURL = 'https://github.com/api/v2/json/repos/show/mozilla/zamboni/branches';

var channels = {
    'zamboni': [irc, amobots, amo],
    'zamboni-lib': [irc, amobots, amo],
};


var updater = {
    'master': 'https://addons-dev.allizom.org/media/updater.output.txt',
}

var checkRev = function(cb) {
    request(branchesURL, function(err, response, body) {
        var ghRev = JSON.parse(body).branches.master;
        request(revURL, function(err, response, body) {
            sys.puts(body, ghRev);
            cb(body, ghRev);
        });
    });
}

irc.on('message', function(from, to, message) {
    if (message == NICK + ': yo') {
        checkRev(function(amo, github) {
            if (github.indexOf(amo) === 0) {
                irc.say(to, format('{0}: -dev is at {1}/commits/{2} (up to date)',
                                   from, repo, amo));
            } else {
                irc.say(to, format('{0}: we are behind master! {1}/compare/{2}...{3}',
                                   from, repo, amo, github.substring(0, 8)));
            }
        });
    }
});

irc.on('error', function(msg) {
    sys.puts('ERROR: ' + msg);
    sys.puts(JSON.stringify(msg));
});
