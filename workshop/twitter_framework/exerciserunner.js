function ExerciseRunner() {
    this.started = false;
}

ExerciseRunner.prototype.stopTweetStream = function() {
    this.tweetSubscription.dispose();
    console.log('Tweet stream stopped.');
}

ExerciseRunner.prototype.multiplierChanged = function () {
    if (this.tweetStream) {
        this.tweetStream.schedulerProvider.timeMultiplier = this.timeMultiplier.value;
        this.multiplierSpan.innerHTML = this.timeMultiplier.value;
    }
}

ExerciseRunner.prototype.setupEventHandlers = function() {
    this.timeMultiplier = document.getElementById('timeMultiplier');
    this.multiplierSpan = document.getElementById('multiplierValue');
    this.useSampleSolutionsButton = document.getElementById('useSampleSolutionsButton');

    this.timeMultiplier.onchange = this.multiplierChanged.bind(this);

    this.startStopButton = document.getElementById('startStopButton');
    this.startStopButton.onclick = this.startStop.bind(this);
}

ExerciseRunner.prototype.createTweetStream = function() {
    this.tweetStream = new TwitterStream();
    this.tweetSubscription = new Rx.CompositeDisposable();
    this.tweetSubscription.add(Rx.Disposable.create(this.tweetStream.stop.bind(this.tweetStream)));
    this.runTweetStream();
}

ExerciseRunner.prototype.startStop = function () {
    // This is exactly the kind of junk code Rx is better at

    if (!this.started)
        this.createTweetStream();
    else
        this.stopTweetStream();

    this.started = !this.started;
    this.startStopButton.innerHTML = this.started ? 'Stop' : 'Start';
}

ExerciseRunner.prototype.runTweetStream = function () {
    var currentTime = this.tweetStream.schedulerProvider.now;
    this.tweetSubscription.add(currentTime.subscribe(this.updateTime.bind(this)));

    this.multiplierChanged();
    this.tweetStream.start();
    var scheduler = this.scheduler = this.tweetStream.schedulerProvider.scheduler;

    var useSampleSolutions = this.useSampleSolutionsButton.checked;
    var exerciseImplementations = useSampleSolutions ? new ExerciseSolutions() : new Exercises();

    this.tweetSubscription.add(this.tweetStream.stream.subscribe(this.showLatestUpdate.bind(this)));

    // Here we go and get all the exercises and subscribe to them so we can display their output
    var tweetSample = exerciseImplementations.exercise1_tweetEvery10Seconds(this.tweetStream.stream, scheduler);
    var tweetsPerMinute = exerciseImplementations.exercise2_numberOfTweetsPerMinute(this.tweetStream.stream, scheduler);
    var interestingTweets = exerciseImplementations.exercise3_findInterestingTweets(this.tweetStream.stream, scheduler);
    var lastMinuteInterestingTweets = interestingTweets.bufferWithTime(60000, 5000, scheduler);

    // Keep all the subscriptions so we can stop them when the Stop button is pushed
    this.tweetSubscription.add(tweetSample.subscribe(this.updateRecentActivity.bind(this)));
    this.tweetSubscription.add(tweetsPerMinute.subscribe(this.updateTweetsPerMinute.bind(this)));
    this.tweetSubscription.add(lastMinuteInterestingTweets.subscribe(this.updateInterestingTweets.bind(this)));

    // Start off the examples that need a minute's data by jumping forward one minute, so we don't have to wait
    scheduler.advanceBy(60000);

    console.log('Tweet stream started.');
}

ExerciseRunner.prototype.showLatestUpdate = function (tweet) {
    this.latestUpdate.tweet = tweet;
    this.latestUpdateRactive.update();
}

ExerciseRunner.prototype.updateTweetsPerMinute = function (tpm) {
    this.exerciseViewModel.tweetsPerMinute = {
        timestamp: moment(this.scheduler.now()).format(timestampFormat),
        count: tpm
    };
    this.exercisesRactive.update();
}

ExerciseRunner.prototype.updateRecentActivity = function (tweet) {
    this.exerciseViewModel.recentTweet = tweet;
    this.exercisesRactive.update();
}

ExerciseRunner.prototype.updateTime = function (time) {
    this.latestUpdate.currentTime = moment(time).format(timestampFormat);
    this.latestUpdateRactive.update();
}

ExerciseRunner.prototype.updateInterestingTweets = function (tweets) {
    this.exerciseViewModel.interestingTweets = tweets;
    this.exercisesRactive.update();
}

ExerciseRunner.prototype.run = function () {
    this.setupEventHandlers();

    this.latestUpdate = { };
    this.latestUpdateRactive = new Ractive(
    {
        el: '#latestUpdateContainer',
        template: '#latestUpdateTemplate',
        data: this.latestUpdate
    });

    this.exerciseViewModel = { };
    this.exercisesRactive = new Ractive(
        {
            el: '#exercisesContainer',
            template: '#exercisesTemplate',
            data: this.exerciseViewModel
        });
}

timestampFormat = 'h:mm:ss A - DD MMM YYYY';
var exerciseRunner = new ExerciseRunner();
window.onload = exerciseRunner.run.bind(exerciseRunner);