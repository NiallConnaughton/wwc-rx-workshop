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
    this.nowSpan = document.getElementById('now');
    this.timeMultiplier = document.getElementById('timeMultiplier');
    this.multiplierSpan = document.getElementById('multiplierValue');
    this.timeMultiplier.onchange = this.multiplierChanged.bind(this);

    var goButton = document.getElementById('goButton');
    goButton.onclick = this.createTweetStream.bind(this);

    var stopButton = document.getElementById('stopButton');
    stopButton.onclick = this.stopTweetStream.bind(this);

    this.tpmSpan = document.getElementById('tpm');
    this.latestTweetSpan = document.getElementById('latestTweet');
    this.useSampleSolutions = document.getElementById('useSampleSolutions');
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
        this.tweetStream.schedulerProvider.now
            .subscribe(function (now) { self.nowSpan.innerText = moment(now).format('YYYY-MM-DD HH:mm:ss'); }));

    this.multiplierChanged();
    this.tweetStream.start();

    var useSolution = this.useSampleSolutions.checked;
    var exerciseImplementations = useSolution ? new ExerciseSolutions() : new Exercises();

    var scheduler = this.tweetStream.schedulerProvider.scheduler;
    var tweetsPerMinute = exerciseImplementations.tweetsPerMinute(this.tweetStream.stream, scheduler);
    var latestTweetDetails = exerciseImplementations.recentActivity(this.tweetStream.stream, scheduler);

    this.tweetSubscription.add(tweetsPerMinute.subscribe(function (tpm) {
        self.tpmSpan.innerText = tpm;
    }));

    this.tweetSubscription.add(latestTweetDetails.subscribe(function (t) {
        self.latestTweetSpan.innerText = t;
    }));

    console.log('Tweet stream started.');
}

var exerciseRunner = new ExerciseRunner();
window.onload = exerciseRunner.setupEventHandlers.bind(exerciseRunner);