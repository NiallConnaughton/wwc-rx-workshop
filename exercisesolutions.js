function ExerciseSolutions() {

}

ExerciseSolutions.prototype.recentActivity = function (tweetStream, scheduler) {
    // See the explanation in Exercises.recentActivity

    /*
        Implementation:
            - Sample a tweet every 5 seconds
            - Take each sampled tweet and map to some information to display

        See:
            sample  - http://reactivex.io/documentation/operators/sample.html
                    - http://tinyurl.com/rxjsdoc/sample.md

            map     - http://reactivex.io/documentation/operators/map.html
                    - http://tinyurl.com/rxjsdoc/select.md
    */

    var dateFormat = 'YYYY-MM-DD HH:mm:ss';
    return tweetStream
        .sample(5000, scheduler)
        .map(function (t) {
            var text = t.Text ? t.Text : '';
            return t.timestamp.format(dateFormat) + ' ' + t.ScreenName + ' ' + text;
        });
}

ExerciseSolutions.prototype.tweetsPerMinute = function (tweetStream, scheduler) {

    var windowIntervals = Rx.Observable.interval(60000, scheduler);
    var tweetsPerMinuteUsingWindow =
            tweetStream.window(windowIntervals)
                       .map(function (tweetsForMinute) { return tweetsForMinute.count(); })
                       .mergeAll();

    var tweetsPerMinuteUsingBuffer =
            tweetStream.bufferWithTime(60000, scheduler)
                       .map(function (tweetsForMinute) {
                           return tweetsForMinute.length;
                       });

    return tweetsPerMinuteUsingBuffer;
}