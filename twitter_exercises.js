function Exercises() {

}

Exercises.prototype.recentActivity = function (tweetStream, scheduler) {
    /*
        Here is an example exercise.

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


    /*
        Example exercise: Display recent tweets

        Let's say we want to see some indication of the tweets that are flowing through.
        Then we can know that the tweet stream is running, and have a look at what people
        are saying. But we don't want to see every single tweet - they'd fly by faster than
        we can read them.
    
        What if we could display one tweet every 5 seconds?
    */ 


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

    return tweetStream.sample(5000, scheduler)
}

Exercises.prototype.tweetsPerMinute = function (tweetStream, scheduler) {
    /*
        Exercise 1: Display the number of tweets per minute

        Implement a function to use tweetStream to work out how many tweets per minute
        we're seeing. We want the return value to be a stream of the number of tweets
        that have happened in the last minute.

        We'll need to use some kind of time based operator to capture a minute's tweets,
        so don't forget to use our virtual scheduler.

        Some operators you might want to look at:
            bufferWithTime  - http://reactivex.io/documentation/operators/buffer.html
                            - http://tinyurl.com/rxjsdoc/bufferwithtime.md
    
            map             - http://reactivex.io/documentation/operators/map.html
                            - http://tinyurl.com/rxjsdoc/select.md
    */

    // Your code goes here!
    return Rx.Observable.never();
}

Exercises.prototype.interestingTweets = function (tweetStream, scheduler) {
    // Pick high retweet count, favourite count, tweets from user with many followers

    // Your code goes here!
    return Rx.Observable.never();
}
