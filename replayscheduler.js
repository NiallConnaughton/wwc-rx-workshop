function ReplayScheduler() {
    this.scheduler = new Rx.VirtualTimeScheduler(0, this.comparer);
    this.scheduler.add = this.addSchedulerTime;
    this.scheduler.toDateTimeOffset = this.toDateTimeOffset;
    this.scheduler.toRelative = this.toRelative;
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