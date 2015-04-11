function ReplayScheduler() {
    this.scheduler = new Rx.VirtualTimeScheduler(0, this.comparer);
    this.scheduler.add = this.addSchedulerTime;
    this.scheduler.toDateTimeOffset = this.toDateTimeOffset;
    this.scheduler.toRelative = this.toRelative;
    this.timeMultiplier = 1;
    this.subscriptions = new Rx.CompositeDisposable();
    this.timeChanged = function () { };
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

ReplayScheduler.prototype.start = function () {
    var self = this;
    this.subscriptions.add(Rx.Observable.interval(1000)
                      .subscribe(function () {
                          self.scheduler.advanceBy(1000 * self.timeMultiplier);
                          self.timeChanged(self.scheduler.now());
                      }));
}

ReplayScheduler.prototype.stop = function () {
    this.subscriptions.dispose();
}