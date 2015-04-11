function ExerciseSolutions() {

}

ExerciseSolutions.prototype.tweetsPerMinute = function (tweetStream) {
    var windowIntervals = Rx.Observable.interval(60000, tweetStream.schedulerProvider.scheduler);
    var tweetsPerMinuteUsingWindow =
            tweetStream.stream
                       .window(windowIntervals)
                       .map(function (tweetsForMinute) { return tweetsForMinute.count(); })
                       .mergeAll();

    var tweetsPerMinuteUsingBuffer =
            tweetStream.stream
                       .bufferWithTime(60000, tweetStream.schedulerProvider.scheduler)
                       .map(function (tweetsForMinute) {
                           return tweetsForMinute.length;
                       });

    return tweetsPerMinuteUsingBuffer;
}