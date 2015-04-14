function ExerciseSolutions() {
}

ExerciseSolutions.prototype.exercise1_tweetEvery10Seconds = function (tweetStream, scheduler) {
    /*
        Sample a tweet every 10 seconds

        See:
            sample  - http://tinyurl.com/rxjsdoc/sample.md
                    - http://reactivex.io/documentation/operators/sample.html
    */

    return tweetStream.sample(10000, scheduler);
}

ExerciseSolutions.prototype.exercise2_numberOfTweetsPerMinute = function (tweetStream, scheduler) {
    /*
        There are (at least) a couple of ways of doing this.
        
        ** Option 1: Buffer the stream to take 1 minute chunks

        Buffer waits for a period of time, and then gives us an array of tweets for
        that period. So we can take buffers of all tweets in the last minute,
        and return the length of each buffer.
        
        This is a simple way of doing it, but we might get hundreds or thousands of
        tweets per minute, which are stored in the buffers. If we have a lot of tweets,
        we may be using a lot more memory than we need. We only care about the
        count, we don't actually use the tweets in the buffer.

        See:
            bufferWithTime  - http://tinyurl.com/rxjsdoc/bufferwithtime.md
                            - http://reactivex.io/documentation/operators/buffer.html

            map             - http://tinyurl.com/rxjsdoc/select.md
                            - http://reactivex.io/documentation/operators/map.html
    */

    var tweetsPerMinuteUsingBuffer =
        tweetStream.bufferWithTime(60000, scheduler)
                   .map(function (tweetsForMinute) { return tweetsForMinute.length; });



    /*  
        ** Option 2: Use Window to divide the stream into 1 minute windows

        We can also use the Window operator. Window divides the stream into many 
        streams that each represent a 1 minute window. We can then get the count
        of each 1 minute window. We never have to store each tweet, so we use
        less memory.

        The biggest difference between Buffer and Window is:
            - Buffer gives us the list of all tweets at the end of each minute
            - Window gives us a new stream of tweets at the start of each minute,
            and each new stream gives the tweets for that minute as they happen.

        This means that Window creates a stream of streams. We want to flatten that
        back to a single stream that contains values for the count of tweets in each
        minute. This is where flatMap comes in.

        See:
            windowWithTime  - http://tinyurl.com/rxjsdoc/windowwithtime.md
                            - http://reactivex.io/documentation/operators/window.html

            flatMap         - http://tinyurl.com/rxjsdoc/select.md
                            - http://reactivex.io/documentation/operators/map.html

            count           - http://tinyurl.com/rxjsdoc/count.md
                            - http://reactivex.io/documentation/operators/count.html
    */


    var tweetsPerMinuteUsingWindow =
            tweetStream.windowWithTime(60000, scheduler)
                       .flatMap(function (tweetsForMinute) { return tweetsForMinute.count(); });


    // Switch these around to see how they work
    return tweetsPerMinuteUsingBuffer;
    // return tweetsPerMinuteUsingWindow;
}

ExerciseSolutions.prototype.exercise3_findInterestingTweets = function (tweetStream, scheduler) {
    /*
        Use filter to pick out tweets from people with many followers, or tweets with
        many retweets or favourites.

        We also use:
            - map to pick out the original tweet from a retweet
            - distinct to prevent us from showing the same retweeted tweet many times
              by giving the distinct operator the unique id of each tweet.

        See:
            filter          - http://tinyurl.com/rxjsdoc/where.md
                            - http://reactivex.io/documentation/operators/filter.html

            map             - http://tinyurl.com/rxjsdoc/select.md
                            - http://reactivex.io/documentation/operators/map.html

            distinct        - http://tinyurl.com/rxjsdoc/distinct.md
                            - http://reactivex.io/documentation/operators/distinct.html
    */

    var highFollowerCount = 100000;
    var highFavouriteCount = 100;
    var highRetweetCount = 100;

    return tweetStream
        .map(function (t) { return t.retweetedTweet ? t.retweetedTweet : t; })
        .filter(function (t) {
            return t.followers > highFollowerCount
                || t.retweetCount > highRetweetCount
                || t.favouriteCount > highFavouriteCount;
        })
        .distinct(function (t) { return t.tweetId; })
}