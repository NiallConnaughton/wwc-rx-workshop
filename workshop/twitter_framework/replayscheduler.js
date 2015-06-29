function ReplayScheduler() {
    this.scheduler = new Rx.VirtualTimeScheduler(0, this.comparer);
    this.scheduler.add = this.addSchedulerTime;
    this.scheduler.toDateTimeOffset = this.toDateTimeOffset;
    this.scheduler.toRelative = this.toRelative;
    this.timeMultiplier = 1;
    this.subscriptions = new Rx.CompositeDisposable();
    this.started = new Rx.Subject();
    this.now = this.getCurrentTimeStream();
}

ReplayScheduler.prototype.addSchedulerTime = function (absolute, relative) {
    return absolute + relative;
};

ReplayScheduler.prototype.toDateTimeOffset = function (absolute) {
    return new Date(absolute).getTime();
};

ReplayScheduler.prototype.toRelative = function (timeSpan) {
    return timeSpan;
};

ReplayScheduler.prototype.comparer = function (x, y) {
    if (x > y) { return 1; }
    if (x < y) { return -1; }
    return 0;
}

ReplayScheduler.prototype.getCurrentTimeStream = function () {
    var refreshInterval = 50;
    var self = this;
    return this.started.map(function () {
        return Rx.Observable.interval(refreshInterval)
                 .do(function () {
                     self.scheduler.advanceBy(refreshInterval * self.timeMultiplier);
                 })
                 .map(function () { return self.scheduler.now(); });
    }).switch();
}

ReplayScheduler.prototype.start = function (startTime) {
    this.scheduler.advanceTo(startTime);
    this.started.onNext(0);
}

ReplayScheduler.prototype.stop = function () {
    this.subscriptions.dispose();
}