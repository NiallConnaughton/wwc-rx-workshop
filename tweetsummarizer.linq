<Query Kind="Program">
  <Reference>&lt;LocalApplicationData&gt;\LINQPad\NuGet\TweetinviAPI\Newtonsoft.Json.6.0.8\lib\net45\Newtonsoft.Json.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Configuration.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Data.Entity.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Data.Services.Client.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Data.Services.Design.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Design.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Runtime.Serialization.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.ServiceModel.Activation.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.ServiceModel.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Web.ApplicationServices.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Web.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Web.Extensions.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Web.Services.dll</Reference>
  <Reference>&lt;RuntimeDirectory&gt;\System.Windows.Forms.dll</Reference>
  <NuGetReference>Ix-Main</NuGetReference>
  <NuGetReference>Rx-Main</NuGetReference>
  <NuGetReference>TweetinviAPI</NuGetReference>
  <Namespace>Autofac.Features.Metadata</Namespace>
  <Namespace>System</Namespace>
  <Namespace>System.Reactive</Namespace>
  <Namespace>System.Reactive.Concurrency</Namespace>
  <Namespace>System.Reactive.Disposables</Namespace>
  <Namespace>System.Reactive.Joins</Namespace>
  <Namespace>System.Reactive.Linq</Namespace>
  <Namespace>System.Reactive.PlatformServices</Namespace>
  <Namespace>System.Reactive.Subjects</Namespace>
  <Namespace>System.Reactive.Threading.Tasks</Namespace>
  <Namespace>System.Web.Script.Serialization</Namespace>
  <Namespace>Tweetinvi</Namespace>
  <Namespace>Tweetinvi.Core.Events.EventArguments</Namespace>
  <Namespace>Tweetinvi.Core.Interfaces</Namespace>
  <Namespace>Tweetinvi.Logic.DTO</Namespace>
  <Namespace>Tweetinvi.Logic.JsonConverters</Namespace>
  <Namespace>Tweetinvi.Logic.Model</Namespace>
  <Namespace>Tweetinvi.Logic.TwitterEntities</Namespace>
  <Namespace>Newtonsoft.Json</Namespace>
  <Namespace>Newtonsoft.Json.Serialization</Namespace>
</Query>

void Main()
{
	SummarizeTweets();
}

void SummarizeTweets()
{
	var path = @"C:\Dev\CWCTwitter\tweets.20150326.085220.json";
	var outputPath = @"C:\Dev\CWCTwitter\1515.inrt.sz.s10.json";
	var tweetJsons = FileLines(path);

	var count = 0;
	
	var start = new DateTime(2015, 03, 26, 15, 15, 00);
	var end = start.AddHours(1.75);
	var tweets = tweetJsons.Sample(i => i % 10 == 0)
						   .Select(js => new TweetEvent { Json = js, Tweet = Tweet.TweetFactory.GenerateTweetFromJson(js) })
						   .Where(te => te.Tweet != null)
						   .Do(te => {
						   			if (++count % 10000 == 0)
										te.Tweet.CreatedAt.Dump();
									})
						   .SkipWhile(te => te.Tweet.CreatedAt < start)
						   .TakeWhile(te => te.Tweet.CreatedAt <= end)
//						   .DuringMatchPlay()
						   .ExcludeNonEnglish()
//						   .ExcludeRetweets()
						   .Select(te => te.Tweet);
	
	var summaryFlags = TweetSummaryFlags.All;// ^ TweetSummaryFlags.IncludeRetweetedTweet;
//	var summarizedTweets = tweets.Select(t => TimestampTweet(t));
	var summarizedTweets = tweets.Select(t => SummarizeTweet(t, summaryFlags));
	
	var serializerSettings = new JsonSerializerSettings {
															DateFormatHandling = DateFormatHandling.IsoDateFormat,
															DateTimeZoneHandling = DateTimeZoneHandling.Utc,
															NullValueHandling = NullValueHandling.Ignore,
															ContractResolver = new CamelCasePropertyNamesContractResolver(),
														};
	var jsonOutput = summarizedTweets.Select(t => JsonConvert.SerializeObject(t, serializerSettings));
	
	var writer = new StreamWriter(outputPath);
	writer.AutoFlush = true;
	
	jsonOutput.Finally(() => writer.Dispose())
			  .ForEach(t => writer.WriteLine(t));
}

public class TweetEvent
{
	public string Json { get; set; }
	public ITweet Tweet { get; set; }
}

private TweetTimestamp TimestampTweet(ITweet t)
{
	return new TweetTimestamp { CreatedAt = t.CreatedAt, ScreenName = t.Creator.ScreenName };
}

private TweetSummary SummarizeTweet(ITweet t, TweetSummaryFlags flags)
{
	var summary = new TweetSummary {
			CreatedAt = t.CreatedAt,
			ScreenName = t.Creator.ScreenName,
		};
		
	if ((flags & TweetSummaryFlags.IncludeText) == TweetSummaryFlags.IncludeText)
		summary.Text = t.Text;
		
	if ((flags & TweetSummaryFlags.IncludeRetweetedTweet) == TweetSummaryFlags.IncludeRetweetedTweet)
	{
		summary.RetweetedTweet = t.RetweetedTweet != null ? SummarizeTweet(t.RetweetedTweet, flags) : null;
		summary.RetweetCount = t.RetweetCount;
		summary.IsRetweet = t.IsRetweet;
		
		if (t.IsRetweet)
		{
			summary.RetweetCount = t.RetweetedTweet.RetweetCount;
			summary.FavouriteCount = t.RetweetedTweet.FavouriteCount;
		}
	}

	if ((flags & TweetSummaryFlags.IncludeHashtags) == TweetSummaryFlags.IncludeHashtags)
		summary.Hashtags = t.Hashtags.Select(ht => ht.Text).ToList();

	if ((flags & TweetSummaryFlags.IncludeMentions) == TweetSummaryFlags.IncludeMentions)
		summary.Mentions = t.UserMentions.Select(m => m.ScreenName).ToList();
		
	if (flags != TweetSummaryFlags.Minimal)
	{
		summary.Followers = t.Creator.FollowersCount;
		summary.FavouriteCount = t.FavouriteCount;
		summary.TweetId = t.Id;
	}
		
	return summary;
}

public enum TweetSummaryFlags
{
	Minimal = 0,
	IncludeText = 1,
	IncludeRetweetedTweet = 2,
	IncludeHashtags = 4,
	IncludeMentions = 8,
	
	All = int.MaxValue
}

public class TweetTimestamp
{
	public DateTime CreatedAt { get; set; }
	public string ScreenName { get; set; }
}

public class TweetSummary
{
	public DateTime CreatedAt { get; set; }
	public int Followers { get; set; }
	public string ScreenName { get; set; }
	public string Text { get; set; }
	public bool IsRetweet { get; set; }
	public List<string> Hashtags { get; set; }
	public List<string> Mentions { get; set; }
	public TweetSummary RetweetedTweet { get; set; }
	public int RetweetCount { get; set; }
	public int FavouriteCount { get; set; }
	public long TweetId { get; set; }
}

public static class TweetStreamEx
{
	public static IEnumerable<TweetEvent> ExcludeNonEnglish(this IEnumerable<TweetEvent> tweets)
	{
		return tweets.Where(t => t.Tweet.Language == Tweetinvi.Core.Enum.Language.Undefined || t.Tweet.Language == Tweetinvi.Core.Enum.Language.English);
	}

	public static IEnumerable<TweetEvent> ExcludeRetweets(this IEnumerable<TweetEvent> tweets)
	{
		return tweets.Where(t => !t.Tweet.IsRetweet);
	}
	
	public static IEnumerable<TweetEvent> DuringMatchPlay(this IEnumerable<TweetEvent> allTweets)
	{
		var startTime = new DateTime(2015, 03, 26, 14, 00, 00);
		var endTime = new DateTime(2015, 03, 26, 23, 30, 00);
		
		return allTweets.SkipWhile(t => t.Tweet.CreatedAt < startTime)
						.TakeWhile(t => t.Tweet.CreatedAt < endTime);
	}

	public static IEnumerable<T> Sample<T>(this IEnumerable<T> allTweets, Func<int, bool> sampler)
	{
		return allTweets.Where((t, i) => sampler(i));
	}

}

IEnumerable<string> FileLines(string filePath)
{
	using (var reader = new StreamReader(filePath))
	{
		while (!reader.EndOfStream)
		{
			yield return reader.ReadLine();
		}
	}
}