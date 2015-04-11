function Exercises() {

}

// http://tinyurl.com/rxjsdoc/* links refer to https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/*

Exercises.prototype.tweetsPerMinute = function (tweetStream) {
    // Implement a function to use tweetStream to work out how many tweets per minute we're streaming

    // We want the return value to be a stream that provides the number of tweets
    // that have happened in the last minute.

    // Some operators you might want to look at:
    //      bufferWithTime  - http://reactivex.io/documentation/operators/buffer.html
    //                      - http://tinyurl.com/rxjsdoc/bufferwithtime.md
    //
    //      map             - http://reactivex.io/documentation/operators/map.html
    //                      - http://tinyurl.com/rxjsdoc/select.md

    return tweetStream.stream
                                    .window(Rx.Observable.interval(60000, tweetStream.schedulerProvider.scheduler))
                                    .map(function (minuteTweet) { return minuteTweet.count(); })
                                    .mergeAll();
}