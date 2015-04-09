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
                        tweet.timestamp = Date.parse(tweet.CreatedAt);

                        if (!startTime)
                            startTime = tweet.timestamp;

                        tweet.timeOffset = tweet.timestamp - startTime;

                        return tweet;
                    });
        //tweets.subscribe(function (t) { console.log(t); });

        var scheduler = new Rx.VirtualTimeScheduler(0, comparer);
        scheduler.add = addSchedulerTime;
        scheduler.toDateTimeOffset = toDateTimeOffset;
        scheduler.toRelative = toRelative;
        //scheduler = new Rx.TestScheduler();
        scheduler.advanceTo(startTime);

        var tweetStream = Rx.Observable.fromArray(tweets)
                            //.take(100)
                            .map(function (t) {
                                //return Rx.Observable.timer(t.timestamp, 0, scheduler);
                                return Rx.Observable.return(t).delay(t.timeOffset, scheduler);
                            })
                            .mergeAll();

        console.log('Tweet stream created.');

        tweetStream.subscribe(function (t) {
            console.log(new Date(t.timestamp) + " - " + t.ScreenName);
        });

        console.log('Subscribed');

        //historicalScheduler.start();
        Rx.Observable.interval(1000).subscribe(function (foo) {
            //multiplier = timeMultiplier.value;
            scheduler.advanceBy(1000 * multiplier);
            nowSpan.innerText = new Date(scheduler.now());
        });

        console.log('Subscribed to scheduler interval');

        //scheduler.start();

        console.log(new Date(startTime));
    };
    //var slice = file.slice(0, 10000);
    //filereader.readAsText(slice);

    filereader.readAsText(file);
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
}

window.onload = setupEventHandlers;