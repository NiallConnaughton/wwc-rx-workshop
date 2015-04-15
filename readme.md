#Reactive Extensions (Rx) Workshop
by Niall Connaughton (@nconnaughton)


----------


This is a set of exercises to give you a feel for the [Reactive Extensions library](https://github.com/Reactive-Extensions), and what you can do with it. We'll be using [RxJS](https://github.com/Reactive-Extensions/RxJS), but the library is available for many platforms, including .Net, Java, Python, Ruby, C++, etc.

Some resources that might be helpful during the workshop:

- The [RxJS operator specifications](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators)
- The [ReactiveX operator descriptions](http://reactivex.io/documentation/operators.html)
- [RxMarbles](http://rxmarbles.com/)

The workshop is in two sections:
- An introduction to using operators in Javascript, and some of the common operators
- An application of Rx on a stream of tweets

------------
### Introduction to Rx Operators 

For this section of the workshop, open the **operator_exercises.html** page in your browser, and the **operator_exercises.js** file in your editor.

Most of the work with Rx is done through chaining operators together. It's a kind of fluent interface. In the first part of the workshop, we'll work through some example operators that are commonly used in Rx:

- [Subscribe](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/subscribe.md) - listen to each event on a stream
- [Map](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/select.md) - convert each event on a stream to a new value (eg: multiply it by two!)
- [Filter](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/where.md) - filter the stream to only events you care about (eg: picking odd numbers from a stream)
- [Sample](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/sample.md) - taking a sample element from a stream periodically
- [Buffer](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/bufferwithtime.md) - dividing a stream into chunks for a period of time

Once we've finished the introduction to the operators, you can choose where to go next:

- If you're new to operators like map and filter and want to learn more, you can do this [interactive tutorial](http://reactive-extensions.github.io/learnrx/) which takes you from first steps through many of the operators.
- If you liked playing with these operators and want to try more, there are many more to look at. You can explore the list of operators on [RxJS](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators) and [ReactiveX](http://reactivex.io/documentation/operators.html).
- Jump into using Rx to work with a stream of tweets in the next section of the workshop

------------
### Applying Rx to a Twitter Stream

For this part of the workshop, open the **twitter_dashboard.html** file in your browser, and the **twitter_exercises.js** file in your editor.

This set of exercises uses a recording of twitter data to recreate a live stream of tweets. We'll see how we can use Rx to manipulate the stream to let us generate real-time information from it.

There is a set of sample solutions for the twitter exercises. You can choose to run the sample solutions on the dashboard to have a look at what output they produce. The solutions are in the **twitter_exercise_solutions/twittersolutions.js** file. One thing to keep in mind: with so many operators in Rx, there are often many ways to solve a problem. So if your solution doesn't match the sample solutions, that's not a bad thing!

Some of the exercises involve using operators that work on periods of time. So that we don't have to wait around for minutes to pass by just to see our output, we can speed up the recorded tweets using the slider at the top of the page. Also, you can pause playback by dragging the speed to 0.

If you get to the end of the twitter exercises and are eager to keep going, there are some ideas at the end of the **twitter_exercises.js** file for what else you could do with this data.

--------------
### After the Workshop

If you are looking to learn more, there are some great resources out there to learn more from:

- The [RxJS page](https://github.com/Reactive-Extensions/RxJS) has lots of information, links to tutorials, books, and videos from NetFlix, etc. It also has a thorough [documentation section](https://github.com/Reactive-Extensions/RxJS/tree/master/doc), including [details of all the operators](https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators).
- [ReactiveX](http://reactivex.io/) has a good description of the operators, giving details of the aliases in each language. They also have some great interactive [marble diagrams](http://rxmarbles.com/).
- The [RxJS book](http://xgrommx.github.io/rx-book/)
- [Intro to Rx](http://introtorx.com/) - a .Net oriented book, but well worth a read for any version of Rx

If you have questions, feel free to contact me on twitter: @nconnaughton