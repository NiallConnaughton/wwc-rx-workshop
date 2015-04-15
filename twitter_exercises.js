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
                      Then these operators will respond when you change the speed of
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

        Let's work out how many tweets per minute we're seeing.

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
    /*
        Exercise 3: Pick out some interesting tweets

        The tweet objects contain more than just the author, time and text. We can see if the tweet is a retweet,
        how many times it's been retweeted, how many followers the author has, and how many times the tweet has
        been favourited.

        A starting point is to look for tweets from authors with 100,000 followers, or tweets that have been
        retweeted or favourited 100 times. This is a good exercise to experiment with.

        The dashboard will use your interesting tweets stream to show the interesting tweets from the last minute.

        The main operator we'll need here is filter:
            - http://tinyurl.com/rxjsdoc/where.md
            - http://reactivex.io/documentation/operators/filter.html

        Have a look at a sample tweet in twitter_data/SingleTweet.json to see the available data and field names.

        A couple of bonus things to think about, specifically for retweets:
            - Do we care who the retweeter is? Can we change our stream so that we
              show the original tweet instead of the retweet, so we show the original author?

            - Tweets can be retweeted many times, so we may end up showing the same tweet
              in our interesting tweets list more than once. Can we get a distinct list of tweets somehow?
    */

    // Your code goes here!
    return Rx.Observable.never();
}

/*
    That's the end of the twitter exercises. But if you're looking for more ideas for what you can do with
    the data, here are some:

        - Display a count of the total number of tweets seen so far. You could use 'scan', or a particular
          version of 'map' for this.

        - A running stream of the most retweeted tweet so far. Have a look at 'scan' for this.

        - Identify sudden spikes in the number of tweets coming through. You could reuse your tweets per
          minute calculator so you can compare the current and previous minute's traffic. To get a stream
          with both the previous and current values, you could use 'scan' (quite a powerful operator!).
          Then you need to pick out cases where the current traffic is significantly different from previous.

        - Lastly - a big one: Pick out interesting tweets following traffic spikes.
          
          Imagine something major has just happened on twitter (in our cricket example, it could be a wicket,
          or a six, or a century, etc). The incident causes a sudden jump in traffic, which you recognise
          from the solution to the exercise above.

          Lots of people are now talking, so what if we could detect major events through traffic, then
          pull out tweets over the next few minutes from people with many followers (eg celebrities, politicians),
          or tweets with lots of retweets.

          With this, we could have a really powerful indicator of major events and what people are talking
          about. This could pick up news events as they happen.

          The good thing about Rx is that we can build on all the previous work you've done, so implementing
          this is only a few extra operators - probably just flatMap and takeUntil.



    I hope you found the exercises useful. If you're interested in learning more, here are some starting points:

        - http://reactivex.io/
        - https://github.com/Reactive-Extensions/RxJS
        - http://introtorx.com/ - a good, free book written on Rx, mostly from the .Net angel, but still valuable
                                  for users of other languages

    If you'd like to get in touch, feel free: nconnaughton@gmail.com
*/
