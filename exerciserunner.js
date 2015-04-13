function ExerciseRunner() {
}

ExerciseRunner.prototype.stopTweetStream = function() {
    this.tweetSubscription.dispose();
    this.started = false;
    console.log('Tweet stream stopped.');
}

ExerciseRunner.prototype.multiplierChanged = function() {
    this.tweetStream.schedulerProvider.timeMultiplier = this.timeMultiplier.value;
    this.multiplierSpan.innerHTML = this.timeMultiplier.value;
}

ExerciseRunner.prototype.setupEventHandlers = function() {
    this.timeMultiplier = document.getElementById('timeMultiplier');
    this.multiplierSpan = document.getElementById('multiplierValue');
    this.useSampleSolutions = document.getElementById('useSampleSolutions');

    this.timeMultiplier.onchange = this.multiplierChanged.bind(this);

    var goButton = document.getElementById('goButton');
    goButton.onclick = this.playPause.bind(this);

    var stopButton = document.getElementById('stopButton');
    stopButton.onclick = this.stopTweetStream.bind(this);
}

ExerciseRunner.prototype.createTweetStream = function() {
    var fileInput = document.getElementById('files');
    var file = fileInput.files[0];
    var filereader = new FileReader();
    var self = this;

    filereader.onload = function (e) {
        var text = filereader.result;

        self.tweetStream = new TwitterStream(text);
        self.tweetSubscription = new Rx.CompositeDisposable();
        self.tweetSubscription.add(Rx.Disposable.create(self.tweetStream.stop.bind(self.tweetStream)));

        self.runTweetStream();
    };

    filereader.readAsText(file);
}

ExerciseRunner.prototype.playPause = function () {
    // This is exactly the kind of junk code Rx is better at

    if (!this.started) {
        this.started = true;
        this.paused = false;
        this.createTweetStream();
    }
    else {
        this.paused = !this.paused;

        var currentMultiplier = this.timeMultiplier.value;
        this.timeMultiplier.value = this.paused ? "0" : this.lastMultiplier;
        this.lastMultiplier = currentMultiplier;
        this.multiplierChanged();

        console.log('Tweet stream ' + (this.paused ? "paused" : "resumed"));
    }
}

ExerciseRunner.prototype.runTweetStream = function () {
    //var self = this;
    this.tweetSubscription.add(
        this.tweetStream.schedulerProvider.now.subscribe(this.updateTime.bind(this)));

    this.multiplierChanged();
    this.tweetStream.start();
    var scheduler = this.scheduler = this.tweetStream.schedulerProvider.scheduler;

    var useSolution = this.useSampleSolutions.checked;
    var exerciseImplementations = useSolution ? new ExerciseSolutions() : new Exercises();

    var tweetsPerMinute = exerciseImplementations.tweetsPerMinute(this.tweetStream.stream, scheduler);
    var latestTweetDetails = exerciseImplementations.recentActivity(this.tweetStream.stream, scheduler);
    var interestingTweets = exerciseImplementations.interestingTweets(this.tweetStream.stream, scheduler);
     var trendingHashtags = exerciseImplementations.trending(this.tweetStream.stream, scheduler);

    this.tweetSubscription.add(tweetsPerMinute.subscribe(this.updateTweetsPerMinute.bind(this)));

    this.tweetSubscription.add(latestTweetDetails.subscribe(this.updateRecentActivity.bind(this)));

    var lastMinuteInterestingTweets = interestingTweets.bufferWithTime(60000, 5000, scheduler);
    this.tweetSubscription.add(lastMinuteInterestingTweets.subscribe(this.updateInterestingTweets.bind(this)));

    this.tweetSubscription.add(trendingHashtags.subscribe(this.updateTrendingHashtags.bind(this)));

    scheduler.advanceBy(60000);

    console.log('Tweet stream started.');
}

ExerciseRunner.prototype.updateTweetsPerMinute = function (tpm) {
    this.recentActivity.tweetsPerMinute = {
        timestamp: moment(this.scheduler.now()).format(timestampFormat),
        count: tpm
    };
    this.recentActivityRactive.update();
}

ExerciseRunner.prototype.updateRecentActivity = function (tweet) {
    this.recentActivity.recentTweet = tweet;
    this.recentActivityRactive.update();
}

ExerciseRunner.prototype.updateTime = function (time) {
    this.recentActivity.currentTime = moment(time).format(timestampFormat);
    this.recentActivityRactive.update();
}

ExerciseRunner.prototype.updateInterestingTweets = function (tweets) {
    this.interestingTweets.tweets = tweets;
    this.interestingTweetsRactive.update();
}

ExerciseRunner.prototype.updateTrendingHashtags = function (hashtags) {
    this.trendingHashtags.trendingTags = hashtags;
    this.trendingRactive.update();
}

ExerciseRunner.prototype.run = function () {
    this.setupEventHandlers();

    this.recentActivity = { };
    this.recentActivityRactive = new Ractive(
        {
            el: '#recentActivityContainer',
            template: '#recentActivityTemplate',
            data: this.recentActivity
        });

    this.interestingTweets = {};
    this.interestingTweetsRactive = new Ractive(
        {
            el: '#interestingTweetsContainer',
            template: '#interestingTweetsTemplate',
            data: this.interestingTweets
        });

    this.trendingHashtags = {};
    this.trendingRactive = new Ractive(
        {
            el: '#trendingContainer',
            template: '#trendingTemplate',
            data: this.trendingHashtags
        });

}

timestampFormat = 'YYYY-MM-DD HH:mm:ss';
var exerciseRunner = new ExerciseRunner();
window.onload = exerciseRunner.run.bind(exerciseRunner);