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
</Query>

void Main()
{
	SummarizeTweets();
}

void SummarizeTweets()
{
	var path = @"C:\Dev\CWCTwitter\tweets.20150326.085220.json";
	var outputPath = @"C:\Dev\CWCTwitter\tweets.summarized.newtonsoft.json";
	var tweetJsons = FileLines(path).Take(200);
	
	var tweets = tweetJsons.Select(js => Tweet.TweetFactory.GenerateTweetFromJson(js))
						   .Where(t => t != null);
	
	ITweet twt;
	
	var summarizedTweets = tweets.Select(SummarizeTweet);
	
//	summarizedTweets
//		.Where(t => t.IsRetweet)
//		.Take(5)
//		.Dump();
		
//	var jsSerializer = new JavaScriptSerializer();
//	var jsonOutput = summarizedTweets.Select(jsSerializer.Serialize);
	var serializerSettings = new JsonSerializerSettings { DateFormatHandling = DateFormatHandling.IsoDateFormat, DateTimeZoneHandling = DateTimeZoneHandling.Utc };
	var jsonOutput = summarizedTweets.Select(t => JsonConvert.SerializeObject(t, serializerSettings));
	
	using (var writer = new StreamWriter(outputPath))
	{
		jsonOutput.ForEach(t => writer.WriteLine(t));
	}
}

private TweetSummary SummarizeTweet(ITweet t)
{
	return new TweetSummary {
			CreatedAt = t.CreatedAt,
			Friends = t.Creator.FriendsCount,
			ScreenName = t.Creator.ScreenName,
			Text = t.Text,
			IsRetweet = t.IsRetweet,
			Hashtags = t.Hashtags.Select(ht => ht.Text).ToList(),
			Mentions = t.UserMentions.Select(m => m.ScreenName).ToList(),
			RetweetedTweet = t.RetweetedTweet != null ? SummarizeTweet(t.RetweetedTweet) : null,
			RetweetCount = t.RetweetCount
		};
}

public class TweetSummary
{
	public DateTime CreatedAt { get; set; }
	public int Friends { get; set; }
	public string ScreenName { get; set; }
	public string Text { get; set; }
	public bool IsRetweet { get; set; }
	public List<string> Hashtags { get; set; }
	public List<string> Mentions { get; set; }
	public TweetSummary RetweetedTweet { get; set; }
	public int RetweetCount { get; set; }
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

void SummarizeFile()
{
	var path = @"C:\Dev\CWCTwitter\tweets.20150326.085220.json";
	var output = @"C:\Dev\CWCTwitter\tweets.summary.json";
	using (var reader = new StreamReader(path))
	using (var writer = new StreamWriter(output))
	{
		Enumerable.Range(0, 5).ForEach(_ => writer.WriteLine(reader.ReadLine()));
	}
	
}

// Define other methods and classes here
