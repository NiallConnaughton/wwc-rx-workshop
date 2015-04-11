function comparer(x, y) {
    if (x > y) { return 1; }
    if (x < y) { return -1; }
    return 0;
}

function addSchedulerTime(absolute, relative) {
    return absolute + relative;
};

function toDateTimeOffset (absolute) {
    return new Date(absolute).getTime();
};

function toRelative (timeSpan) {
    return timeSpan;
};

function runTweetStream() {
    var fileInput = document.getElementById('files');
    var file = fileInput.files[0];
    var filereader = new FileReader();
    filereader.onload = function (e) {
        text = filereader.result;
        split = text.split('\r\n');

        startTime = 0;

        tweets = split
            .filter(function (line) { return line !== ""; })
            .map(function (json) {
                tweet = JSON.parse(json);
                tweet.timestamp = moment(tweet.CreatedAt);
                return tweet;
            });
        
        startTime = tweets[0].timestamp;

        //tweets.subscribe(function (t) { console.log(t); });

        var scheduler = new Rx.VirtualTimeScheduler(0, comparer);
        scheduler.add = addSchedulerTime;
        scheduler.toDateTimeOffset = toDateTimeOffset;
        scheduler.toRelative = toRelative;
        scheduler.advanceTo(startTime);

        var tweetStream = Rx.Observable.for(tweets, function (t) {
            return Rx.Observable.timer(t.timestamp.toDate(), scheduler)
                                .map(function () { return t; });
        });

        tweetSubscription = new Rx.CompositeDisposable();

        tweetSubscription.add(tweetStream.subscribe(function (t) {
            console.log(t.timestamp.toDate() + " - " + t.ScreenName);
        }));

        tweetSubscription.add(
            Rx.Observable.interval(1000)
                         .subscribe(function() {
                                            scheduler.advanceBy(1000 * multiplier);
                                            nowSpan.innerText = moment(scheduler.now()).format('YYYY-MM-DD HH:mm:ss');
                         }));

        var tweetsPerMinute = tweetStream.window(Rx.Observable.timer(60000, scheduler))
                   .map(function (minuteTweet) {
                       return minuteTweet.count();
                   })
                   .mergeAll();

        tweetSubscription.add(tweetsPerMinute.subscribe(function (tpm) {
            tpmSpan.innerText = tpm;
        }));

        console.log('Tweet stream started.');
    };

    filereader.readAsText(file);
}

function stopTweetStream() {
    tweetSubscription.dispose();
    console.log('Tweet stream stopped.');
}

function multiplierChanged() {
    multiplier = timeMultiplier.value;
    multiplierSpan.innerHTML = timeMultiplier.value;
}

function setupEventHandlers() {
    nowSpan = document.getElementById('now');
    timeMultiplier = document.getElementById('timeMultiplier');
    multiplierSpan = document.getElementById('multiplierValue');
    timeMultiplier.onchange = multiplierChanged;
    multiplierChanged();

    var goButton = document.getElementById('goButton');
    goButton.onclick = runTweetStream;

    var stopButton = document.getElementById('stopButton');
    stopButton.onclick = stopTweetStream;

    tpmSpan = document.getElementById('tpm');
}

window.onload = setupEventHandlers;