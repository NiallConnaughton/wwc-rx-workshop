function ExerciseRunner() {
}

ExerciseRunner.prototype.stopTweetStream = function() {
    this.tweetSubscription.dispose();
    console.log('Tweet stream stopped.');
}

ExerciseRunner.prototype.multiplierChanged = function() {
    this.tweetStream.schedulerProvider.timeMultiplier = timeMultiplier.value;
    this.multiplierSpan.innerHTML = timeMultiplier.value;
}

ExerciseRunner.prototype.setupEventHandlers = function() {
    this.timeMultiplier = document.getElementById('timeMultiplier');
    this.multiplierSpan = document.getElementById('multiplierValue');
    this.useSampleSolutions = document.getElementById('useSampleSolutions');

    this.timeMultiplier.onchange = this.multiplierChanged.bind(this);

    var goButton = document.getElementById('goButton');
    goButton.onclick = this.createTweetStream.bind(this);

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

ExerciseRunner.prototype.runTweetStream = function() {
    var self = this;
    this.tweetSubscription.add(
        this.tweetStream.schedulerProvider.now.subscribe(this.updateTime.bind(self)));

    this.multiplierChanged();
    this.tweetStream.start();
    var scheduler = this.scheduler = this.tweetStream.schedulerProvider.scheduler;

    var useSolution = this.useSampleSolutions.checked;
    var exerciseImplementations = useSolution ? new ExerciseSolutions() : new Exercises();

    var tweetsPerMinute = exerciseImplementations.tweetsPerMinute(this.tweetStream.stream, scheduler);
    var latestTweetDetails = exerciseImplementations.recentActivity(this.tweetStream.stream, scheduler);
    var interestingTweets = exerciseImplementations.interestingTweets(this.tweetStream.stream, scheduler);

    this.tweetSubscription.add(tweetsPerMinute.subscribe(this.updateTweetsPerMinute.bind(self)));

    this.tweetSubscription.add(latestTweetDetails.subscribe(this.updateRecentActivity.bind(self)));

    this.tweetSubscription.add(interestingTweets.subscribe(this.updateInterestingTweets.bind(self)));
    //function (t) {
    //    self.interestingTweetSpan.innerText = t;
    //}));

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

ExerciseRunner.prototype.updateInterestingTweets = function (tweet) {
    this.interestingTweets.tweet = tweet;
    this.interestingTweetsRactive.update();
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
}

timestampFormat = 'YYYY-MM-DD HH:mm:ss';
var exerciseRunner = new ExerciseRunner();
window.onload = exerciseRunner.run.bind(exerciseRunner);