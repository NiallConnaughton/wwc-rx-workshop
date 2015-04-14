function exercise1_subscribe() {
	// Observable.interval(1000) gives us a number every second
	// The take operator gives us the first 10, otherwise this will continue forever

	var numbers = Rx.Observable.interval(1000).take(10);

	// Notice that we just chain the .take(10) on the end. Virtually all Rx operators are like this,
	// which lets us put together multiple different operations in a simple form.

	// To actually see what the observable does, we have to subscribe to it.
	// When we subscribe, we get a new number every second. The interval operator
	// just pushes increasing numbers to us.

	// For these exercises, we'll just log to the console
	numbers.subscribe(function (n) { console.log(n); });
}

function exercise2_map() {
	// The map operator is used to transform each value in a source sequence to a new value
	// Using map looks like this:
	//     .map(function (number) { return someOtherValue; })

	// Let's add one to each number in the stream using map
	var numbers = Rx.Observable.interval(1000).take(10);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise3_mapSquareNumbers() {
	// What about generating a stream of square numbers - how can we use map to do that?

	var numbers = Rx.Observable.interval(1000).take(10);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise4_filterGreaterThan3() {
	// The filter operator lets you filter out values in a stream.
	// Using filter looks like this:
	//     .filter(function (number) { return <evaluate some condition on number>; })
	
	// Note = the filter condition defines what to include - only elements where the filter is true will be
	// included in the result.

	// Let's write a simple filter that gives us only the values greater than 3

	var numbers = Rx.Observable.interval(1000).take(10);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise5_filterOutOddNUmbers() {
	// Now let's use the filter operator to pick out only even numbers

	var numbers = Rx.Observable.interval(1000).take(10);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise6_sample() {
	// All the sequences up till now have been ticking once a second. What if we have a sequence
	// that is ticking faster than we want?

	// Using sample looks like this:
	//		.sample(<number of milliseconds>)

	// This stream is ticking 10 times a second. Let's use the sample operator to take a sample
	// every second.

	var numbers = Rx.Observable.interval(100).take(50);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise7_distinct() {
	// Sometimes the same value will appear more than once on a stream. That might be fine,
	// but maybe you only want to see unique values. The distinct operator can do this for us.

	// The stream below loops through the numbers 0-4
	// Let's cut it down so we don't see the same number twice.

	var numbers = Rx.Observable.interval(1000).take(10)
					.map(function (n) { return n % 4; });

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise8_bufferWithTime() {
	// The buffer operator divides the stream up into chunks of values. It can give us a chunk
	// of time, or a chunk of a certain number, or even both.

	// Let's look at bufferWithTime first. Using bufferWithTime looks like this:
	// 		.bufferWithTime(<number of milliseconds>)

	// Let's use bufferWithTime to divide up the stream into 3 second blocks

	var numbers = Rx.Observable.interval(1000).take(20);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise9_bufferWithCount() {
	// bufferWithCount is very similar, but it lets us take a specific number of values as a single chunk

	// Let's divide the stream up into chunks of 5 values each
	var numbers = Rx.Observable.interval(1000).take(17);

	numbers.subscribe(function (n) { console.log(n); });
}

function exercise10_objectsAsValues() {
	// Thankfully, we're not just limited to having numbers as the values in our streams. The values can
	// be anything!

	// This is what can really make Rx useful. We can have streams of business objects - customer orders,
	// images, web search results, etc. This is when the operators start to get interesting.

	// Let's make a stream of customer orders
	var orders =
				[
					{ customer: 'Joe', cost: 500, description: 'Fancy shoes' },
					{ customer: 'Jane', cost: 2000, description: 'Macbook Pro' },
					{ customer: 'Bob', cost: 50, description: 'Phone charger' },
					{ customer: 'Sam', cost: 230, description: 'Office chair' },
					{ customer: 'Chris', cost: 75, description: 'Kettle' },
					{ customer: 'Sally', cost: 5000, description: 'Digital Camera' }
				];

	var orderStream = Rx.Observable.interval(1000).take(orders.length)
						.map(function (n) { return orders[n]; });

	// Now we have a collection of orders that happen over time.
	// Let's put a few operators together and get the description of items that cost more than $300

	var expensiveOrders = orderStream;
	// We need to use a couple of operators on the order stream to get the information we want.

	expensiveOrders.subscribe(function (n) { console.log(n); });
}

// That's the end of the operator exercises. But there are many more operators in Rx.

// *** Where to next?
//
// *** If you're new to operators like map and filter and want to learn more:
// There's a good interactive tutorial at http://reactive-extensions.github.io/learnrx/
//
// It runs through the operators step by step, starting from loops, to show you how they work.
// Just remember to make sure you have your console window visible, as it displays its results there.
//
//
// *** If you liked playing with these operators and want to try more:
// There are many more to look at. Some more interesting ones:
// 		- skip, takeWhile, skipWhile
// 		- skipUntil, takeUntil
//		- first, last
// 		- count
// 		- aggregate
// 		- scan
// 		- average/max/min/sum
// 		- distinctUntilChanged
// 		- delay
// 		- timer
// 		- window (similar to buffer)
//		- groupby
//		- merge/concat
//		- timeout
//		- combineLatest/zip
// Documentation for all the operators can be found here:
// http://reactivex.io/documentation/operators.html
// https://github.com/Reactive-Extensions/RxJS/tree/master/doc/api/core/operators
//
//
// *** If you want to have a look at applying Rx to a realtime stream,
// load up the twitter_dashboard.html page, and open then twitter_exercises.js file in your editor.
// The dashboard runs through a stream of twitter tweets and generates some stats out of the data.









console.log('Use "run(<exercise number>)" to execute a specific exercise.');
exercises = [ exercise1_subscribe, exercise2_map, exercise3_mapSquareNumbers, exercise4_filterGreaterThan3, exercise5_filterOutOddNUmbers,
			  exercise6_sample, exercise7_distinct, exercise8_bufferWithTime, exercise9_bufferWithCount, exercise10_objectsAsValues ];
function run(number) {
	var exercise = exercises[number - 1];

	var name = exercise.toString();
	name = name.substr('function '.length);
	name = name.substr(0, name.indexOf('('));

	console.log('Running ' + name);
	exercise();
}
