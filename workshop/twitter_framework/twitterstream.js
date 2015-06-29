function TwitterStream() {
    this.schedulerProvider = new ReplayScheduler();
    this.stopped = new Rx.Subject();

    var scheduler = this.schedulerProvider.scheduler;
    var tweets = tweetSourceData;
    tweets.forEach(this.updateTweet.bind(this));
    this.startTime = tweets[0].timestamp;

    var combinedTweets = Rx.Observable.for(tweets, function (t) {
        return Rx.Observable.timer(t.timestamp.toDate(), scheduler)
                            .map(function () { return t; });
    });

    var self = this;
    this.stream = combinedTweets
                    .takeUntil(this.stopped)
                    .finally(function () { self.schedulerProvider.stop(); })
                    .share();
}

TwitterStream.prototype.updateTweet = function (tweet) {
    this.setTimestamps(tweet);
    if (tweet.retweetedTweet)
        this.setTimestamps(tweet.retweetedTweet);
}

TwitterStream.prototype.setTimestamps = function (tweet) {
    tweet.timestamp = moment(tweet.createdAt);
    tweet.displayTimestamp = tweet.timestamp.format(timestampFormat);
}

TwitterStream.prototype.start = function () {
    this.schedulerProvider.start(this.startTime);
}

TwitterStream.prototype.stop = function () {
    this.stopped.onNext(0);
}