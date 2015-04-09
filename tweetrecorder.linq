<Query Kind="Program">
  <NuGetReference>Ix-Main</NuGetReference>
  <NuGetReference>Rx-Main</NuGetReference>
  <Namespace>System</Namespace>
  <Namespace>System.Reactive</Namespace>
  <Namespace>System.Reactive.Concurrency</Namespace>
  <Namespace>System.Reactive.Disposables</Namespace>
  <Namespace>System.Reactive.Joins</Namespace>
  <Namespace>System.Reactive.Linq</Namespace>
  <Namespace>System.Reactive.PlatformServices</Namespace>
  <Namespace>System.Reactive.Subjects</Namespace>
  <Namespace>System.Reactive.Threading.Tasks</Namespace>
</Query>

void Main()
{
//	SetTwitterCredentials();
	
//	RecordTweets();
	LoadTweets();
//	CheckMetadata();
}

void CheckMetadata()
{
//	Tweetinvi.Search.GenerateTweetSearchParameter(
	var tweets = Tweetinvi.Timeline.GetUserTimeline("turnbullmalcolm", maximumTweets: 500);
	
	tweets
		.Where(t => t.Coordinates != null)
		.Select(t => new { t.Text, t.CreatedAt, t.Coordinates })
		.Dump();
//	tweets.Dump();

}

void LoadTweets()
{
	var folder = @"c:\dev\cwctwitter";
	var files = Directory.GetFiles(folder, "audind.english.json");
	
//	var jsonConvert = TweetinviContainer.Resolve<IJsonObjectConverter>();
	
	var lines = files.ToObservable().SelectMany(ReadFileLines);
	var tweets = lines.Select(l => new TweetEvent { Json = l, Tweet = Tweet.TweetFactory.GenerateTweetFromJson(l) })
					  .Where(td => td.Tweet != null)
					  .Publish().RefCount();
					  
	DumpSample(tweets, "Reading");
					  
	var filteredTweets = tweets.DuringMatchPlay()
//							   .ExcludeNonEnglish()
							   .Where((t, i) => i % 10 == 0)
							   .Publish().RefCount();
	
	var filePath = @"c:\dev\cwctwitter\out.json";
	
	WriteStreamToDisk(filteredTweets.Select(t => t.Json), filePath, append: false);

	DumpSample(filteredTweets, "Writing");
	
//	filteredTweets.Take(10).Select(t => t.Text).Dump();
//	filteredTweets.Take(5).Dump();
}

void DumpSample(IObservable<TweetEvent> tweets, string heading)
{
	tweets.Select((t, i) => new { TweetDetails = t, Count = i })
		  .Sample(TimeSpan.FromSeconds(10))
		  .Select(td => new { Count = td.Count, td.TweetDetails.Tweet.CreatedAt, td.TweetDetails.Tweet.Text })
		  .DumpLive(heading);
}


public static class TweetStreamEx
{
	public static IObservable<TweetEvent> ExcludeNonEnglish(this IObservable<TweetEvent> tweets)
	{
		return tweets.Where(t => t.Tweet.Language == Tweetinvi.Core.Enum.Language.Undefined || t.Tweet.Language == Tweetinvi.Core.Enum.Language.English);
	}

	public static IObservable<TweetEvent> ExcludeRetweets(this IObservable<TweetEvent> tweets)
	{
		return tweets.Where(t => !t.Tweet.IsRetweet);
	}
	
	public static IObservable<TweetEvent> DuringMatchPlay(this IObservable<TweetEvent> allTweets)
	{
		var startTime = new DateTime(2015, 03, 26, 14, 00, 00);
		var endTime = new DateTime(2015, 03, 26, 23, 30, 00);
		
		return allTweets.SkipWhile(t => t.Tweet.CreatedAt < startTime)
						.TakeWhile(t => t.Tweet.CreatedAt < endTime);
	}

}

IObservable<string> ReadFileLines(string filePath)
{
//	return Observable.Using(() => new StreamReader(filePath),
//	reader => Observable.Generate<StreamReader, string>(new FileReadState { Reader = reader, Line = reader.readli, reader => reader.EndOfStream, 
//	return Observable.Using(() => new StreamReader(filePath),
//	reader => Observable.Repeat(reader.ReadLineAsync().ToObservable())
////						.Merge()
//						.TakeWhile(_ => !reader.EndOfStream));
	
	return Observable.Create<string>(observer =>
	{
		var reader = new StreamReader(filePath);
		bool cancelled = false;

		var cancel = Disposable.Create(() => cancelled = true);

		Scheduler.Default.Schedule(() =>
		{
			while (!cancelled && !reader.EndOfStream)
			{
				var line = reader.ReadLine();
				observer.OnNext(line);
			}
		});
		
		return new CompositeDisposable(reader, cancel);
	});
}


void SetTwitterCredentials()
{
	var accessToken = "78420259-NEWN1bUxgUnTbbtaka7hOgXDZyT1fhMgCAJCdgJlR";
	var accessSecret = "OZdW2d1O4cAtngLPnTi0HzvZacbMR2ysVi9xuzUzTA4Wi";
	var apiKey = "c4kCUyZalNv7c6VYGX98z5P1E";
	var apiSecret = "MIRG24OTITMLuONuPO1r41yXm8e845TQrM0Dd5pqu553DDIjHK";
	TwitterCredentials.SetCredentials(accessToken, accessSecret, apiKey, apiSecret);
}

public static class OEx
{
	public static IObservable<Unit> ToUnit<T>(this IObservable<T> src)
	{
		return src.Select(_ => Unit.Default);
	}
	
	public static IObservable<TSource> BeforeSubscribe<TSource>(this IObservable<TSource> src, Action beforeSubscribe)
	{
		return Observable.Create<TSource>(observer =>
		{
			beforeSubscribe();
			return src.Subscribe(observer);
		});		
	}
	
	public static IObservable<TSource> RetryWithDelay<TSource>(this IObservable<TSource> source, TimeSpan retryDelay,
            int? maxRetries = null, Action<Exception> onError = null, IScheduler scheduler = null)
	{
		return source.RetryWithDelay<TSource, Exception>(retryDelay, maxRetries, onError, scheduler);
	}
	
	public static IObservable<TSource> RetryWithDelay<TSource, TException>(this IObservable<TSource> source, TimeSpan retryDelay,
            int? maxRetries = null, Action<TException> onError = null, IScheduler scheduler = null)
                where TException : Exception
        {
            scheduler = scheduler ?? CurrentThreadScheduler.Instance;

            return Observable.Create<TSource>(observer =>
            {
                int retries = 0;
                var sourceSubscription = new SerialDisposable();

                var scheduled = scheduler.Schedule(TimeSpan.Zero,
                                   self =>
                                   {
                                       sourceSubscription.Disposable = source.SubscribeSafe(
                                           Observer.Create<TSource>(observer.OnNext,
                                           ex =>
                                           {
                                               bool exceededMaxRetries = maxRetries.HasValue && ++retries > maxRetries;
                                               if (ex is TException && !exceededMaxRetries)
                                               {
                                                   if (onError != null)
                                                       onError((TException)ex);

                                                   self(retryDelay);
                                               }
                                               else
                                                   observer.OnError(ex);
                                           },
                                           observer.OnCompleted));
                                   });

                return new CompositeDisposable(scheduled, sourceSubscription);
            });
        }
}

void RecordTweets()
{
	var tracks = new[] { "indvsaus", "ausvsind", "cwc15", "cricket", "world cup", "cricketworldcup", "wontgiveitback", "bleedblue" };
	
	var stream = CreateStream(tracks);
	stream.Window(Observable.Interval(TimeSpan.FromSeconds(60)))
		  .Select(tweetsPerMinute => tweetsPerMinute.Count())
		  .Merge()
		  .Select(tpm => string.Format("{0}: {1} tweets per minute", DateTime.Now.ToString("HH:mm:ss"), tpm))
		  .Dump();
		  
	stream.Sample(TimeSpan.FromSeconds(10)).Select(t => new { t.Tweet.CreatedAt, t.Tweet.Text }).DumpLatest();
		  
	var filePath = string.Format(@"c:\dev\cwctwitter\tweets.{0}.json", DateTime.Now.ToString("yyyyMMdd.HHmmss"));
	WriteStreamToDisk(stream.Select(t => t.Json), filePath);
}

void WriteStreamToDisk(IObservable<string> jsonStream, string filePath, bool append = true)
{
	var sw = new StreamWriter(filePath, append);
	sw.AutoFlush = true;

	jsonStream.Finally(sw.Close).Subscribe(sw.WriteLine);
}

public class TweetEvent

{
	public string Json { get; set; }
	public ITweet Tweet { get; set; }
}

int id = 0;

private string Timestamp()
{
	return DateTime.Now.ToString("HH:mm:ss.fff");
}

IObservable<TweetEvent> CreateStream(string[] tracks)
{
	return Observable.Create<TweetEvent>(observer =>
	{
		var streamId = ++id;
		var disposables = new CompositeDisposable();
		bool stopped = false;
		
		var filteredStream = CreateFilteredStream(tracks);
		var tweetStream = GetStream(filteredStream);
		var disconnectionStream = GetReconnectionRequiredEvents(filteredStream, tweetStream);
		
		disposables.Add(disconnectionStream.Where(_ => !stopped)
										   .Do(msg => string.Format("{0}: Stream {1} lost connection: {2}", Timestamp(), streamId, msg).Dump())
										   .Subscribe(msg => observer.OnError(new Exception(msg))));

		var stopHandler = Disposable.Create(() =>
			{
				stopped = true;
				StopStream(filteredStream, streamId);
			});
			
		disposables.Add(stopHandler);

		disposables.Add(tweetStream.Subscribe(observer));
		StartStream(filteredStream, streamId);
		
		return disposables;
	})
	.ObserveOn(Scheduler.Default)
	.RetryWithDelay(TimeSpan.FromSeconds(5))
	.Publish().RefCount();
}

void StartStream(IFilteredStream stream, int streamId)
{
	string.Format("{0}: Starting stream {1}", Timestamp(), streamId).Dump();
	stream.StartStreamMatchingAnyConditionAsync();
}

void StopStream(IFilteredStream stream, int streamId)
{
	string.Format("{0}: Stopping stream {1}", Timestamp(), streamId).Dump();
	stream.StopStream();
}

IFilteredStream CreateFilteredStream(string[] tracks)
{
	var filteredStream = Tweetinvi.Stream.CreateFilteredStream();
	tracks.ForEach(t => filteredStream.AddTrack(t));
	return filteredStream;
}

IObservable<TweetEvent> GetStream(IFilteredStream filteredStream)
{
	var jsonConvert = TweetinviContainer.Resolve<IJsonObjectConverter>();

	var tweets = Observable.FromEventPattern<JsonObjectEventArgs>(filteredStream, "JsonObjectReceived")
						   .Select(ea => new TweetEvent
						   					{
												Json = ea.EventArgs.Json,
												Tweet = Tweet.GenerateTweetFromDTO(jsonConvert.DeserializeObject<ITweetDTO>(ea.EventArgs.Json))
											});
									   
	return tweets;
}

private IObservable<string> GetReconnectionRequiredEvents(IFilteredStream filteredStream, IObservable<TweetEvent> tweets)
{
	// If we have a 90 second gap between tweets, something looks fishy
	var lostActivity = tweets.Throttle(TimeSpan.FromSeconds(90))
							 .Select(_ => "No tweets for 90 seconds");

	var disconnects = Observable.FromEventPattern<DisconnectMessageEventArgs>(filteredStream , "DisconnectMessageReceived")
								.Select(dc => string.Format("Disconnect event received: {0}", dc.EventArgs.DisconnectMessage));
								
//	var limitReached = Observable.FromEventPattern<LimitReachedEventArgs>(filteredStream, "LimitReached")
//								 .Do(_ => string.Format("limit reached on stream {0}, missed tweets: {1}", streamId, _.EventArgs.NumberOfTweetsNotReceived).Dump())
//								 .ToUnit();
								 
	var stopped = Observable.FromEventPattern<StreamExceptionEventArgs>(filteredStream, "StreamStopped")
							.Where(e => e.EventArgs.Exception != null)
							.Select(_ => string.Format("Stopped event raised: {0}", _.EventArgs.Exception));
	
	return disconnects.Merge(stopped)
					  .Merge(lostActivity)
					  .FirstAsync()
					  .Publish().RefCount();
}