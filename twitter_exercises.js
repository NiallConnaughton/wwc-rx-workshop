function Exercises() { }

/*
    Each exercise will be a function that receives:
          tweetStream - This is the stream of tweets, which we can manipulate to come
                        up with new streams, like the number of tweets per minute, or
                        current popular hashtags, etc.

          scheduler - Our virtual time scheduler. The scheduler is important, because
                      it's how we speed up time so we can see results from our exercises
                      faster.

                      You need to use the scheduler for any operators you use that
                      involve timing - like sample, bufferWithTime, window, timer, etc.
                      Then these operators will respond when you increase the speed of
                      the tweet stream.

    Each exercise needs to return a new stream that we can subscribe to and display
    on the screen.
*/

Exercises.prototype.exercise1_tweetEvery10Seconds = function (tweetStream, scheduler) {
    /*
        Exercise 1: Display recent tweets

        The tweets come in too fast to look at every one. Let's take a tweet from the stream every ten seconds instead.
        We saw an operator from the previous exercises that could help here.

        Remember to use the scheduler as the last argument for any timing based operators.

        You might want to look at:
            sample  - http://tinyurl.com/rxjsdoc/sample.md
                    - http://reactivex.io/documentation/operators/sample.html
    */

    // Your code goes here!
    return Rx.Observable.never();
}

Exercises.prototype.exercise2_numberOfTweetsPerMinute = function (tweetStream, scheduler) {
    /*
        Exercise 2: Display the number of tweets per minute

        Implement a function to use tweetStream to work out how many tweets per minute
        we're seeing. We want the return value to be a stream of the number of tweets
        that have happened in the last minute.

        Remember to use the scheduler as the last argument for any timing based operators.

        Some operators you might want to look at:
            bufferWithTime  - http://tinyurl.com/rxjsdoc/bufferwithtime.md
                            - http://reactivex.io/documentation/operators/buffer.html
    
            map             - http://tinyurl.com/rxjsdoc/select.md
                            - http://reactivex.io/documentation/operators/map.html
    */

    // Your code goes here!
    return Rx.Observable.never();
}

Exercises.prototype.exercise3_findInterestingTweets = function (tweetStream, scheduler) {
    // Pick high retweet count, favourite count, tweets from user with many followers

    // Your code goes here!
    return Rx.Observable.never();
}
