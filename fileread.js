function runTweetStream() {
    var fileInput = document.getElementById('files');
    var file = fileInput.files[0];
    var filereader = new FileReader();
    filereader.onload = function (e) {
        text = filereader.result;

        tweetStream = new TwitterStream(text);
        tweetSubscription = new Rx.CompositeDisposable();
        tweetSubscription.add(Rx.Disposable.create(tweetStream.stop.bind(tweetStream)));

        tweetSubscription.add(tweetStream.stream.subscribe(function (t) {
            console.log(t.timestamp.toDate() + " - " + t.ScreenName);
        }));

        tweetStream.schedulerProvider.timeChanged =
            function (now) { nowSpan.innerText = moment(now).format('YYYY-MM-DD HH:mm:ss'); };

        multiplierChanged();
        tweetStream.start();

        var tweetsPerMinute = tweetStream.stream
                                         .window(Rx.Observable.interval(60000, tweetStream.schedulerProvider.scheduler))
                                         .map(function (minuteTweet) { return minuteTweet.count(); })
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
    tweetStream.schedulerProvider.timeMultiplier = timeMultiplier.value;
    multiplierSpan.innerHTML = timeMultiplier.value;
}

function setupEventHandlers() {
    nowSpan = document.getElementById('now');
    timeMultiplier = document.getElementById('timeMultiplier');
    multiplierSpan = document.getElementById('multiplierValue');
    timeMultiplier.onchange = multiplierChanged;

    var goButton = document.getElementById('goButton');
    goButton.onclick = runTweetStream;

    var stopButton = document.getElementById('stopButton');
    stopButton.onclick = stopTweetStream;

    tpmSpan = document.getElementById('tpm');
}

window.onload = setupEventHandlers;