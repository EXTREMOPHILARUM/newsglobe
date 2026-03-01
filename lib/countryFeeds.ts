// Comprehensive country feed data: 150 countries
// Countries with Google News editions use those; others use direct RSS fallback feeds

export interface FeedEntry {
  url: string;
  name?: string; // publication name (from upstream)
  category?: string; // upstream category (mapped to our Category at fetch time)
}

export interface CountryData {
  code: string;
  name: string;
  lat: number;
  lng: number;
  // Google News params (if supported)
  gl?: string;
  ceid?: string;
  hl?: string;
  // Fallback RSS feeds for countries without Google News
  fallbackFeeds?: (string | FeedEntry)[];
}

export const COUNTRIES: CountryData[] = [
  // --- Google News supported countries ---
  {
    code: "US",
    name: "United States",
    lat: 39.8,
    lng: -98.5,
    gl: "US",
    ceid: "US:en",
    hl: "en-US",
    fallbackFeeds: [
      { url: "http://sports.espn.go.com/espn/rss/news", name: "ESPN" },
      {
        url: "http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
        name: "The New York Times",
      },
      {
        url: "http://abcnews.go.com/xmldata/rss?id=4380645",
        name: "ABCNews.com",
      },
      { url: "http://www.latimes.com/rss2.0.xml", name: "Los Angeles Times" },
      { url: "http://www.yardbarker.com/rss/rumors", name: "Yardbarker.com" },
    ],
  },
  {
    code: "GB",
    name: "United Kingdom",
    lat: 54.0,
    lng: -2.0,
    gl: "GB",
    ceid: "GB:en",
    hl: "en-GB",
    fallbackFeeds: [
      { url: "http://feeds.bbci.co.uk/news/rss.xml", name: "BBC" },
      { url: "https://uk.news.yahoo.com/rss/uk", name: "Yahoo! UK News" },
      { url: "http://feeds.bbci.co.uk/news/england/rss.xml", name: "BBC News" },
      { url: "http://www1.skysports.com/rss/11095", name: "Sky Sports" },
      { url: "http://www.mirror.co.uk/news/rss.xml", name: "Mirror" },
    ],
  },
  {
    code: "IN",
    name: "India",
    lat: 20.6,
    lng: 78.9,
    gl: "IN",
    ceid: "IN:en",
    hl: "en-IN",
    fallbackFeeds: [
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128838597.cms",
        name: "Times of India (Mumbai)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128839596.cms",
        name: "Times of India (Delhi)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128833038.cms",
        name: "Times of India (Bangalore)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128816011.cms",
        name: "Times of India (Hyderabad)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/2950623.cms",
        name: "Times of India (Chennai)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128821153.cms",
        name: "Times of India (Ahemdabad)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3947060.cms",
        name: "Times of India (Allahabad)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/4118235.cms",
        name: "Times of India (Bhubaneswar)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/7503091.cms",
        name: "Times of India (Coimbatore)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/6547154.cms",
        name: "Times of India (Gurgaon)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/4118215.cms",
        name: "Times of India (Guwahati)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3942695.cms",
        name: "Times of India (Hubli)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3947067.cms",
        name: "Times of India (Kanpur)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128830821.cms",
        name: "Times of India (Kolkata)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3947051.cms",
        name: "Times of India (Ludhiana)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3942690.cms",
        name: "Times of India (Mangalore)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3942693.cms",
        name: "Times of India (Mysore)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/8021716.cms",
        name: "Times of India (Noida)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128821991.cms",
        name: "Times of India (Pune)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3012535.cms",
        name: "Times of India (Goa)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128816762.cms",
        name: "Times of India (Chandigarh)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128819658.cms",
        name: "Times of India (Lucknow)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128817995.cms",
        name: "Times of India (Patna)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3012544.cms",
        name: "Times of India (Jaipur)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/442002.cms",
        name: "Times of India (Nagpur)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3942663.cms",
        name: "Times of India (Rajkot)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/4118245.cms",
        name: "Times of India (Ranchi)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3942660.cms",
        name: "Times of India (Surat)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3942666.cms",
        name: "Times of India (Vadodara)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3947071.cms",
        name: "Times of India (Varanasi)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3831863.cms",
        name: "Times of India (Thane)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/878156304.cms",
        name: "Times of India (Thiruvananthapuram)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeedstopstories.cms",
        name: "Times of India (Top Stories)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeedmostrecent.cms",
        name: "Times of India (Most Recent Stories)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms",
        name: "Times of India (India)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
        name: "Times of India (World)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/7098551.cms",
        name: "Times of India (NRI)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/1898055.cms",
        name: "Times of India (Business)",
      },
      {
        url: "https://timesofindia.indiatimes.com/rssfeeds_us/72258322.cms",
        name: "Times of India (US)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/54829575.cms",
        name: "Times of India (Cricket)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/4719148.cms",
        name: "Times of India (Sports)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/-2128672765.cms",
        name: "Times of India (Science)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/2647163.cms",
        name: "Times of India (Environment)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/66949542.cms",
        name: "Times of India (Tech)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/913168846.cms",
        name: "Times of India (Education)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/1081479906.cms",
        name: "Times of India (Entertainment)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/2886704.cms",
        name: "Times of India (Life & Style)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeedmostread.cms",
        name: "Times of India (Most Read)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeedmostshared.cms",
        name: "Times of India (Most Shared)",
      },
      {
        url: "https://timesofindia.indiatimes.com/rssfeeds/65857041.cms",
        name: "Times of India (Astrology)",
      },
      {
        url: "https://timesofindia.indiatimes.com/rssfeeds/74317216.cms",
        name: "Times of India (Auto)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/30359486.cms",
        name: "Times of India (US)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/30359534.cms",
        name: "Times of India (Pakistan)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/3907412.cms",
        name: "Times of India (South Asia)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/2177298.cms",
        name: "Times of India (UK)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/1898274.cms",
        name: "Times of India (Europe)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/1898184.cms",
        name: "Times of India (China)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/1898272.cms",
        name: "Times of India (Middle East)",
      },
      {
        url: "http://timesofindia.indiatimes.com/rssfeeds/671314.cms",
        name: "Times of India (Rest of World)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-top-stories",
        name: "NDTV (Top Stories)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-latest",
        name: "NDTV (Latest Stories)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-trending-news",
        name: "NDTV (Trending Stories)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-india-news",
        name: "NDTV (India)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-world-news",
        name: "NDTV (World)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvprofit-latest",
        name: "NDTV (Business)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvmovies-latest",
        name: "NDTV (Movies)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvsports-latest",
        name: "NDTV (Sports)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvsports-cricket",
        name: "NDTV (Cricket)",
      },
      {
        url: "https://feeds.feedburner.com/gadgets360-latest",
        name: "NDTV (Tech)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-cities-news",
        name: "NDTV (Cities)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-south",
        name: "NDTV (South)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-indians-abroad",
        name: "NDTV (Indians Abroad)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvcooks-latest",
        name: "NDTV (Health)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-offbeat-news",
        name: "NDTV (Offbeat)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvnews-people",
        name: "NDTV (People)",
      },
      {
        url: "https://feeds.feedburner.com/ndtvkhabar-latest",
        name: "NDTV (Hindi)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/recentstories",
        name: "Economic Times B2B (Recent Stories)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/entrepreneur",
        name: "Economic Times B2B (Entrepreneur)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/infra",
        name: "Economic Times B2B (Infra)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/travel",
        name: "Economic Times B2B (Travel)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/hr",
        name: "Economic Times B2B (HR)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/hospitality",
        name: "Economic Times B2B (Hospitality)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/legal",
        name: "Economic Times B2B (Legal)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/auto",
        name: "Economic Times B2B (Auto)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/retail",
        name: "Economic Times B2B (Retail)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/health",
        name: "Economic Times B2B (Health)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/telecom",
        name: "Economic Times B2B (Telecom)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/energy",
        name: "Economic Times B2B (Energy)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/cio",
        name: "Economic Times B2B (CIO)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/realty",
        name: "Economic Times B2B (Realty)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/government",
        name: "Economic Times B2B (Government)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/brand-equity",
        name: "Economic Times B2B (BrandEquity)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/bfsi",
        name: "Economic Times B2B (BFSI)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/ciso",
        name: "Economic Times B2B (CISO)",
      },
      {
        url: "https://b2b.economictimes.indiatimes.com/rss/cfo",
        name: "Economic Times B2B (CFO)",
      },
      { url: "http://www.india.com/feed/", name: "India.com" },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/movies.xml",
        name: "News18 (Movies)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/india.xml",
        name: "News18 (India)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/entertainment.xml",
        name: "News18 (Entertainment)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/politics.xml",
        name: "News18 (Politics)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/cricket.xml",
        name: "News18 (Cricket)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/world.xml",
        name: "News18 (World)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/business.xml",
        name: "News18 (Business)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/education-career.xml",
        name: "News18 (Education-Career)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/opinion.xml",
        name: "News18 (Opinion)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/explainers.xml",
        name: "News18 (Explainers)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/tech.xml",
        name: "News18 (Tech)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/auto.xml",
        name: "News18 (Auto)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/sports.xml",
        name: "News18 (Sports)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/football.xml",
        name: "News18 (Football)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/astrology.xml",
        name: "News18 (Astrology)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/web-stories.xml",
        name: "News18 (Web Stories)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/viral.xml",
        name: "News18 (Viral)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/elections.xml",
        name: "News18 (Elections)",
      },
      {
        url: "https://www.news18.com/commonfeeds/v1/eng/rss/lifestyle-2.xml",
        name: "News18 (Lifestyle)",
      },
      {
        url: "https://zeenews.india.com/rss/india-national-news.xml",
        name: "Zee News (Nation)",
      },
      {
        url: "https://zeenews.india.com/rss/world-news.xml",
        name: "Zee News (World)",
      },
      {
        url: "https://zeenews.india.com/rss/india-news.xml",
        name: "Zee News (States)",
      },
      {
        url: "https://zeenews.india.com/rss/asia-news.xml",
        name: "Zee News (Asia)",
      },
      {
        url: "https://zeenews.india.com/rss/business.xml",
        name: "Zee News (Business)",
      },
      {
        url: "https://zeenews.india.com/rss/sports-news.xml",
        name: "Zee News (Sports)",
      },
      {
        url: "https://zeenews.india.com/rss/science-environment-news.xml",
        name: "Zee News (Science & Environment)",
      },
      {
        url: "https://zeenews.india.com/rss/entertainment-news.xml",
        name: "Zee News (Entertainment)",
      },
      {
        url: "https://zeenews.india.com/rss/health-news.xml",
        name: "Zee News (Health)",
      },
      {
        url: "https://zeenews.india.com/rss/blog-news.xml",
        name: "Zee News (Blogs)",
      },
      {
        url: "https://zeenews.india.com/rss/technology-news.xml",
        name: "Zee News (Technology)",
      },
      {
        url: "https://www.thehindu.com/sport/feeder/default.rss",
        name: "The Hindu (Sport)",
      },
      { url: "https://www.indiatoday.in/rss/home", name: "India Today (Home)" },
      {
        url: "https://www.indiatoday.in/rss/1206514",
        name: "India Today (Nation)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206551",
        name: "India Today (Leisure)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206614",
        name: "India Today (The Big Story)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206509",
        name: "India Today (Cover Story)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206610",
        name: "India Today (Glass House)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206494",
        name: "India Today (Eyecatchers)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206613",
        name: "India Today (Glossary)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206584",
        name: "India Today (Top Stories)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206500",
        name: "India Today (States)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206513",
        name: "India Today (Economy)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206577",
        name: "India Today (World)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206550",
        name: "India Today (Sport)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206503",
        name: "India Today (Offtrack)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206504",
        name: "India Today (Society and The Arts)",
      },
      {
        url: "https://www.indiatoday.in/rss/1206506",
        name: "India Today (Your Week)",
      },
      {
        url: "http://rss.jagran.com/local/uttar-pradesh/lucknow-city.xml",
        name: "Dainik Jagran",
      },
      { url: "https://www.newslaundry.com/stories.rss", name: "News Laundry" },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1944.xml",
        name: "Dainik Bhaskar (Opinion)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-14994.xml",
        name: "Dainik Bhaskar (Budget 2025)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-11215.xml",
        name: "Dainik Bhaskar (Bollywood)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-10711.xml",
        name: "Dainik Bhaskar (Auto)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-11945.xml",
        name: "Dainik Bhaskar (Jobs & Education)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1532.xml",
        name: "Dainik Bhaskar (Women)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-5707.xml",
        name: "Dainik Bhaskar (Tech - Auto)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-7911.xml",
        name: "Dainik Bhaskar (Happy Life)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-11616.xml",
        name: "Dainik Bhaskar (Utility)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1125.xml",
        name: "Dainik Bhaskar (International)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1061.xml",
        name: "Dainik Bhaskar (National)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1051.xml",
        name: "Dainik Bhaskar (Business)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1053.xml",
        name: "Dainik Bhaskar (Sports)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-10891.xml",
        name: "Dainik Bhaskar (Fake News Expose)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1057.xml",
        name: "Dainik Bhaskar (Magazine)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-3379.xml",
        name: "Dainik Bhaskar (Jeevan Mantra)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-3998.xml",
        name: "Dainik Bhaskar (Entertainment)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-4587.xml",
        name: "Dainik Bhaskar (DB Original)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1740.xml",
        name: "Dainik Bhaskar (Rajasthan)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1739.xml",
        name: "Dainik Bhaskar (Madhya Pradesh)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-2052.xml",
        name: "Dainik Bhaskar (Uttar Pradesh)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-3679.xml",
        name: "Dainik Bhaskar (Bihar)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1741.xml",
        name: "Dainik Bhaskar (Chhattisgarh)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1742.xml",
        name: "Dainik Bhaskar (Haryana)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-7140.xml",
        name: "Dainik Bhaskar (New Delhi)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-2318.xml",
        name: "Dainik Bhaskar (Maharashtra)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-3682.xml",
        name: "Dainik Bhaskar (Jharkhand)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-1743.xml",
        name: "Dainik Bhaskar (Punjab)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-2314.xml",
        name: "Dainik Bhaskar (Gujarat)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-11649.xml",
        name: "Dainik Bhaskar (Chandigarh)",
      },
      {
        url: "https://www.bhaskar.com/rss-v1--category-12084.xml",
        name: "Dainik Bhaskar (Himachal)",
      },
      {
        url: "http://feeds.bbci.co.uk/news/world/asia/india/rss.xml",
        name: "BBC News - India",
      },
      {
        url: "https://www.theguardian.com/world/india/rss",
        name: "India | The Guardian",
      },
      { url: "https://www.sebi.gov.in/sebirss.xml", name: "SEBI RSS Feed" },
      {
        url: "https://timesofindia.indiatimes.com/rssfeedstopstories.cms",
        name: "Times of India",
      },
      {
        url: "https://www.news18.com/rss/world.xml",
        name: "Top World News- News18.com",
      },
      { url: "https://www.dnaindia.com/feeds/india.xml", name: "India News" },
      {
        url: "https://www.freepressjournal.in/stories.rss",
        name: "Free Press Journal",
      },
      {
        url: "https://www.deccanchronicle.com/rss_feed/",
        name: "Deccan Chronicle - Latest India news | Breaking news | Hyderabad News | World news | Business news | Politics | Technology news",
      },
      {
        url: "https://economictimes.indiatimes.com/rssfeedsdefault.cms",
        name: "Economic Times",
      },
      {
        url: "http://feeds.feedburner.com/ScrollinArticles.rss",
        name: "Scroll.in",
      },
      {
        url: "https://www.thehindubusinessline.com/feeder/default.rss",
        name: "Business Line - Home",
      },
      { url: "http://feeds.feedburner.com/techgenyz", name: "TechGenyz" },
      {
        url: "https://www.gujaratsamachar.com/rss/top-stories",
        name: "Top Stories News - Gujarat Samachar : World's Leading Gujarati Newspaper",
      },
      {
        url: "https://prod-qt-images.s3.amazonaws.com/production/swarajya/feed.xml",
        name: "Swarajya",
      },
      {
        url: "https://www.amarujala.com/rss/breaking-news.xml",
        name: "Latest And Breaking Hindi News Headlines, News In Hindi | अमर उजाला हिंदी न्यूज़ | - Amar Ujala",
      },
      {
        url: "https://www.bhaskar.com/rss-feed/1061/",
        name: "देश | दैनिक भास्कर",
      },
      {
        url: "https://www.divyabhaskar.co.in/rss-feed/1037/",
        name: "ઈન્ડિયા | દિવ્ય ભાસ્કર",
      },
    ],
  },
  {
    code: "AU",
    name: "Australia",
    lat: -25.3,
    lng: 133.8,
    gl: "AU",
    ceid: "AU:en",
    hl: "en-AU",
    fallbackFeeds: [
      { url: "http://www.abc.net.au/news/feed/46182/rss.xml", name: "ABC" },
      { url: "http://www.theage.com.au/rssheadlines/top.xml", name: "The Age" },
      {
        url: "http://www.brisbanetimes.com.au/rssheadlines/top.xml",
        name: "Brisbane Times",
      },
      {
        url: "https://www.smh.com.au/rss/feed.xml",
        name: "Sydney Morning Herald - Latest News",
      },
      {
        url: "https://www.abc.net.au/news/feed/1948/rss.xml",
        name: "ABC News",
      },
    ],
  },
  {
    code: "CA",
    name: "Canada",
    lat: 56.1,
    lng: -106.3,
    gl: "CA",
    ceid: "CA:en",
    hl: "en-CA",
    fallbackFeeds: [
      { url: "https://www.cbc.ca/cmlink/rss-topstories", name: "CBC News" },
      { url: "https://ici.radio-canada.ca/rss/4159", name: "Radio Canada" },
      { url: "https://nationalpost.com/feed/", name: "National Post" },
      { url: "https://torontosun.com/category/news/feed", name: "Toronto Sun" },
      { url: "https://globalnews.ca/feed/", name: "Global News" },
    ],
  },
  {
    code: "DE",
    name: "Germany",
    lat: 51.2,
    lng: 10.4,
    gl: "DE",
    ceid: "DE:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://www.welt.de/?service=Rss", name: "DIE WELT" },
      {
        url: "http://rss.sueddeutsche.de/rss/Wirtschaft",
        name: "Sueddeutsche.de",
      },
      { url: "http://www.stern.de/feed/standard/all/", name: "STERN" },
      { url: "http://newsfeed.zeit.de/index", name: "ZEIT" },
      {
        url: "http://www.faz.net/rss/aktuell/",
        name: "Frankfurter Allgemeine",
      },
    ],
  },
  {
    code: "FR",
    name: "France",
    lat: 46.2,
    lng: 2.2,
    gl: "FR",
    ceid: "FR:en",
    hl: "en",
    fallbackFeeds: [
      { url: "https://www.france24.com/fr/rss", name: "France 24" },
      { url: "https://www.lemonde.fr/rss/une.xml", name: "Le Monde" },
      {
        url: "https://www.lefigaro.fr/rss/figaro_actualites.xml",
        name: "Le Figaro",
      },
      { url: "https://www.rfi.fr/fr/france/rss", name: "RFI" },
      {
        url: "https://feeds.leparisien.fr/leparisien/rss",
        name: "Le Parisien",
      },
    ],
  },
  {
    code: "JP",
    name: "Japan",
    lat: 36.2,
    lng: 138.3,
    gl: "JP",
    ceid: "JP:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://www.nhk.or.jp/rj/podcast/rss/english.xml", name: "NHK" },
      {
        url: "http://www.dailymail.co.uk/sport/index.rss",
        name: "Daily Sports Online",
      },
      {
        url: "http://www.nikkansports.com/soccer/atom.xml",
        name: "nikkansports.com",
      },
      {
        url: "http://news.livedoor.com/topics/rss/int.xml",
        name: "livedoor News",
      },
      {
        url: "https://www.japantimes.co.jp/feed/topstories/",
        name: "Japan Times latest articles",
      },
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    lat: -14.2,
    lng: -51.9,
    gl: "BR",
    ceid: "BR:pt-419",
    hl: "pt-BR",
    fallbackFeeds: [
      { url: "http://rss.home.uol.com.br/index.xml", name: "UOL Notícias" },
      { url: "https://oglobo.globo.com/rss/oglobo", name: "O Globo" },
      { url: "https://veja.abril.com.br/rss/", name: "Veja" },
      {
        url: "https://www.estadao.com.br/arc/outboundfeeds/feeds/rss/sections/geral/",
        name: "Estadão",
      },
      { url: "https://ge.globo.com/rss/ge", name: "globoesporte.com" },
    ],
  },
  {
    code: "MX",
    name: "Mexico",
    lat: 23.6,
    lng: -102.6,
    gl: "MX",
    ceid: "MX:es-419",
    hl: "es-MX",
    fallbackFeeds: [
      { url: "http://www.reforma.com/rss/portada.xml", name: "Reforma.com" },
      {
        url: "http://feeds.feedburner.com/SDPnoticiascom",
        name: "SDPnoticias.com",
      },
      {
        url: "https://www.theguardian.com/world/mexico/rss",
        name: "Mexico | The Guardian",
      },
      { url: "https://www.reforma.com/rss/portada.xml", name: "Reforma" },
      {
        url: "https://vanguardia.com.mx/rss.xml",
        name: "Lo último en Vanguardia MX",
      },
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    lat: -30.6,
    lng: 22.9,
    gl: "ZA",
    ceid: "ZA:en",
    hl: "en-ZA",
    fallbackFeeds: [
      { url: "http://www.channel24.pk/feed/", name: "Channel24" },
      {
        url: "http://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
        name: "Business Day",
      },
      { url: "https://techcentral.co.za/feed", name: "TechCentral" },
      { url: "https://citizen.co.za/feed/", name: "The Citizen" },
      { url: "https://www.dailymaverick.co.za/dmrss/", name: "Daily Maverick" },
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    lat: 9.1,
    lng: 8.7,
    gl: "NG",
    ceid: "NG:en",
    hl: "en-NG",
    fallbackFeeds: [
      { url: "http://www.punchng.com/feed/", name: "Punch" },
      { url: "http://www.wikihow.com/feed.rss", name: "This Day" },
      { url: "http://www.informationng.com/feed", name: "Information Nigeria" },
      {
        url: "https://www.nigerianbulletin.com/forums/-/index.rss",
        name: "Nigeria News Links | Today\'s Updates - Nigerian Bulletin",
      },
      {
        url: "http://feeds.feedburner.com/Nigerianeye",
        name: "Nigerian News. Latest Nigeria News. Your online Nigerian Newspaper.",
      },
    ],
  },
  {
    code: "KE",
    name: "Kenya",
    lat: -0.02,
    lng: 37.9,
    gl: "KE",
    ceid: "KE:en",
    hl: "en-KE",
    fallbackFeeds: [
      {
        url: "http://www.standardmedia.co.ke/rss/business.php",
        name: "Standard Media",
      },
      { url: "http://nairobiwire.com/feed", name: "Nairobi Wire" },
    ],
  },
  {
    code: "EG",
    name: "Egypt",
    lat: 26.8,
    lng: 30.8,
    gl: "EG",
    ceid: "EG:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://www.shorouknews.com/columns/rss/", name: "Shorouk" },
      {
        url: "http://www.fifplay.com/pes2015-wishlist/feed/",
        name: "Stad El Ahly",
      },
      {
        url: "http://www.ikhwanwiki.com/index.php?title=%D9%85%D9%84%D9%81_%D8%A7%D9%84%D8%A5%D8%AE%D9%88%D8%A7%D9%86_%D9%81%D9%8A_%D8%A7%D9%84%D9%8A%D9%85%D9%86&feed=atom&action=history",
        name: "IkhwanOnline.com",
      },
    ],
  },
  {
    code: "IL",
    name: "Israel",
    lat: 31.0,
    lng: 34.9,
    gl: "IL",
    ceid: "IL:en",
    hl: "en-IL",
    fallbackFeeds: [
      {
        url: "http://www.ynet.co.il/Integration/StoryRss3082.xml",
        name: "Ynet",
      },
      { url: "http://rcs.mako.co.il/rss/MainSliderRss.xml", name: "Mako" },
      {
        url: "http://www.globes.co.il/webservice/rss/rssfeeder.asmx/FeederNode?iID=585",
        name: "Globes",
      },
      { url: "http://www.one.co.il/RSS/Winner", name: "ONE" },
      {
        url: "http://www.jpost.com/RSS/RssFeedsFrontPage.aspx",
        name: "Jerusalem Post",
      },
    ],
  },
  {
    code: "AE",
    name: "UAE",
    lat: 23.4,
    lng: 53.8,
    gl: "AE",
    ceid: "AE:en",
    hl: "en",
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    lat: 23.9,
    lng: 45.1,
    gl: "SA",
    ceid: "SA:en",
    hl: "en",
  },
  {
    code: "KR",
    name: "South Korea",
    lat: 35.9,
    lng: 127.8,
    gl: "KR",
    ceid: "KR:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://rss.donga.com/sports.xml", name: "DongA.com" },
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    lat: 1.35,
    lng: 103.8,
    gl: "SG",
    ceid: "SG:en",
    hl: "en-SG",
    fallbackFeeds: [
      { url: "http://www.tnp.sg/rss.xml", name: "The New paper" },
    ],
  },
  {
    code: "ID",
    name: "Indonesia",
    lat: -0.8,
    lng: 113.9,
    gl: "ID",
    ceid: "ID:en",
    hl: "en-ID",
    fallbackFeeds: [
      {
        url: "http://sindikasi.okezone.com/index.php/rss/0/RSS2.0",
        name: "okezone.com",
      },
      {
        url: "https://www.republika.co.id/rss/",
        name: "Republika Online RSS Feed",
      },
    ],
  },
  {
    code: "RU",
    name: "Russia",
    lat: 61.5,
    lng: 105.3,
    gl: "RU",
    ceid: "RU:en",
    hl: "en",
    fallbackFeeds: [
      { url: "https://ria.ru/export/rss2/index.xml", name: "RIA Novosti" },
      { url: "http://lenta.ru/rss/", name: "Lenta.ru" },
      { url: "http://www.utro.ru/export/rss2.xml", name: "Utro.ru" },
      {
        url: "http://www.rg.ru/xml/index.xml",
        name: "RG.ru Rossiyskaya Gazeta",
      },
      { url: "http://www.infox.ru/rss.xml", name: "infox.ru" },
    ],
  },
  {
    code: "IT",
    name: "Italy",
    lat: 41.9,
    lng: 12.6,
    gl: "IT",
    ceid: "IT:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://www.repubblica.it/rss/homepage/rss2.0.xml",
        name: "La Repubblica",
      },
      { url: "http://www.ansa.it/english/english_rss.xml", name: "ANSA.it" },
      {
        url: "http://www.tgcom24.mediaset.it/rss/homepage.xml",
        name: "TGcom24",
      },
      { url: "http://www.leonardo.it/feed", name: "Leonardo.it" },
      { url: "http://www.ilmessaggero.it/rss/home.xml", name: "Il Messaggero" },
    ],
  },
  {
    code: "ES",
    name: "Spain",
    lat: 40.5,
    lng: -3.7,
    gl: "ES",
    ceid: "ES:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada",
        name: "EL PAIS",
      },
      { url: "https://www.abc.es/rss/atom/portada/", name: "ABC" },
      {
        url: "https://e00-elmundo.uecdn.es/rss/portada.xml",
        name: "elmundo.es",
      },
      {
        url: "https://www.antena3.com/noticias/rss/4013050.xml",
        name: "Antena 3",
      },
      {
        url: "https://www.lavanguardia.com/rss/home.xml",
        name: "LaVanguardia.com",
      },
    ],
  },
  {
    code: "PL",
    name: "Poland",
    lat: 51.9,
    lng: 19.1,
    gl: "PL",
    ceid: "PL:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://rss.gazeta.pl/pub/rss/wiadomosci.xml", name: "Gazeta.pl" },
      { url: "http://pogoda.interia.pl/feed", name: "INTERIA.PL" },
      { url: "http://wiadomosci.onet.pl/.feed", name: "Onet Wiadomosci" },
      { url: "http://wiadomosci.wp.pl/rss.xml", name: "WP.pl Wiadomosci" },
      { url: "http://www.money.pl/rss/main.xml", name: "Money.pl" },
    ],
  },
  {
    code: "UA",
    name: "Ukraine",
    lat: 48.4,
    lng: 31.2,
    gl: "UA",
    ceid: "UA:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://gazeta.ua/ru/rss", name: "Gazeta.ua" },
      { url: "http://censor.net.ua/includes/news_ru.xml", name: "Censor.net" },
      { url: "http://kp.ua/rss/feed.xml", name: "Komsomolskaya pravda" },
      { url: "http://obozrevatel.com/rss.xml", name: "Obozrevatel.com" },
      { url: "http://comments.ua/export/rss_ru.xml", name: "comments.ua" },
    ],
  },
  {
    code: "AR",
    name: "Argentina",
    lat: -38.4,
    lng: -63.6,
    gl: "AR",
    ceid: "AR:es-419",
    hl: "es-AR",
    fallbackFeeds: [
      { url: "https://www.clarin.com/rss/lo-ultimo/", name: "Clarin" },
      {
        url: "https://www.lanacion.com.ar/arc/outboundfeeds/rss/?outputType=xml",
        name: "La Nacion",
      },
      {
        url: "https://www.infobae.com/arc/outboundfeeds/rss/",
        name: "Infobae",
      },
      { url: "https://www.perfil.com/feed", name: "Perfil.com" },
      {
        url: "https://www.cronista.com/files/rss/news.xml",
        name: "El Cronista",
      },
    ],
  },
  {
    code: "CO",
    name: "Colombia",
    lat: 4.6,
    lng: -74.3,
    gl: "CO",
    ceid: "CO:es-419",
    hl: "es-CO",
    fallbackFeeds: [
      {
        url: "http://www.elcolombiano.com/rss/inicio.xml",
        name: "El Colombiano",
      },
      { url: "http://www.futbolred.com/feeds/home", name: "Futbolred.com" },
    ],
  },
  {
    code: "PH",
    name: "Philippines",
    lat: 12.9,
    lng: 121.8,
    gl: "PH",
    ceid: "PH:en",
    hl: "en-PH",
    fallbackFeeds: [
      { url: "http://www.inquirer.net/fullfeed", name: "Inquirer.net" },
      {
        url: "http://www.philstar.com/rss/entertainment",
        name: "PhilSTAR.com",
      },
      { url: "http://www.interaksyon.com/rss", name: "InterAksyon" },
      { url: "https://www.inquirer.net/fullfeed", name: "INQUIRER.net" },
      { url: "https://www.interaksyon.com/feed/", name: "Interaksyon" },
    ],
  },
  {
    code: "TW",
    name: "Taiwan",
    lat: 23.7,
    lng: 121.0,
    gl: "TW",
    ceid: "TW:en",
    hl: "en-TW",
  },
  {
    code: "TH",
    name: "Thailand",
    lat: 15.9,
    lng: 100.5,
    gl: "TH",
    ceid: "TH:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://rssfeeds.sanook.com/rss/feeds/sanook/news.crime.xml",
        name: "news.sanook.com",
      },
    ],
  },
  {
    code: "AT",
    name: "Austria",
    lat: 47.5,
    lng: 14.6,
    gl: "AT",
    ceid: "AT:de",
    hl: "de",
    fallbackFeeds: [
      { url: "http://www.krone.at/Nachrichten/rss.html", name: "Krone.at" },
      {
        url: "http://www.kleinezeitung.at/rss/wirtschaft",
        name: "Kleine Zeitung",
      },
      { url: "http://kurier.at/xml/feed", name: "KURIER.at" },
      { url: "http://diepresse.com/rss/Wirtschaft", name: "DiePresse.com" },
      {
        url: "http://www.vol.at/rss/tp:vol:vorarlberg",
        name: "Vorarlberg Online",
      },
    ],
  },
  {
    code: "CH",
    name: "Switzerland",
    lat: 46.8,
    lng: 8.2,
    gl: "CH",
    ceid: "CH:de",
    hl: "de",
    fallbackFeeds: [
      { url: "http://www.tagesanzeiger.ch/rss.html", name: "Tages Anzeiger" },
      {
        url: "http://www.nzz.ch/startseite.rss",
        name: "Neue Zuercher Zeitung",
      },
      { url: "http://www.srf.ch/sport/bnf/rss/718", name: "SRF Sport" },
      { url: "http://www.24heures.ch/rss.html", name: "24 heures" },
      { url: "http://www.bernerzeitung.ch/rss.html", name: "Berner Zeitung" },
    ],
  },
  {
    code: "BE",
    name: "Belgium",
    lat: 50.9,
    lng: 4.4,
    gl: "BE",
    ceid: "BE:fr",
    hl: "fr",
    fallbackFeeds: [
      { url: "https://www.lalibre.be/rss", name: "La Libre" },
      {
        url: "https://www.dhnet.be/arc/outboundfeeds/rss/?outputType=xml",
        name: "DH",
      },
      { url: "https://demorgen.be/in-het-nieuws/rss.xml", name: "De Morgen" },
      {
        url: "https://rss.rtbf.be/article/rss/highlight_rtbf_info.xml?source=internal",
        name: "RTBF",
      },
      { url: "https://www.hln.be/home/rss.xml", name: "HLN" },
    ],
  },
  {
    code: "NL",
    name: "Netherlands",
    lat: 52.1,
    lng: 5.3,
    gl: "NL",
    ceid: "NL:nl",
    hl: "nl",
    fallbackFeeds: [
      { url: "http://www.nu.nl/feeds/rss/algemeen.rss", name: "nu.nl" },
      { url: "https://feeds.nos.nl/nosnieuwsalgemeen", name: "NOS.nl" },
      { url: "http://www.ad.nl/rss.xml", name: "AD.nl" },
      { url: "http://www.volkskrant.nl/sport/rss.xml", name: "Volkskrant" },
      { url: "https://www.nrc.nl/rss/", name: "NRC" },
    ],
  },
  {
    code: "IE",
    name: "Ireland",
    lat: 53.1,
    lng: -7.7,
    gl: "IE",
    ceid: "IE:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://www.independent.ie/irish-news/rss",
        name: "Irish Independent",
      },
      { url: "http://www.thejournal.ie/feed/", name: "TheJournal.ie" },
      {
        url: "http://feeds.breakingnews.ie/bnireland?format=xml",
        name: "BreakingNews.ie",
      },
      {
        url: "http://www.irishcentral.com/templates/section_feed_content_abstract.rss?section=/news/politics",
        name: "IrishCentral",
      },
      { url: "http://www.donegaldaily.com/feed/", name: "Donegal Daily" },
    ],
  },
  {
    code: "PT",
    name: "Portugal",
    lat: 39.4,
    lng: -8.2,
    gl: "PT",
    ceid: "PT:pt-150",
    hl: "pt-PT",
    fallbackFeeds: [
      {
        url: "https://rss.impresa.pt/feed/latest/expresso.rss?type=ARTICLE,VIDEO,GALLERY,STREAM,PLAYLIST,EVENT,NEWSLETTER&limit=20&pubsubhub=true",
        name: "Expresso",
      },
      { url: "https://feeds.feedburner.com/PublicoRSS", name: "Público" },
      { url: "https://www.cmjornal.pt/rss", name: "Correio da Manhã" },
      { url: "https://www.record.pt/rss/", name: "Jornal Record" },
      { url: "https://tvi.iol.pt/rss.xml", name: "TVI" },
    ],
  },
  {
    code: "SE",
    name: "Sweden",
    lat: 60.1,
    lng: 18.6,
    gl: "SE",
    ceid: "SE:sv",
    hl: "sv",
    fallbackFeeds: [
      { url: "http://www.expressen.se/rss/nyheter", name: "Expressen" },
      { url: "https://www.svt.se/rss.xml", name: "SVT" },
      { url: "http://www.dn.se/nyheter/m/rss", name: "DN.se" },
      { url: "http://www.di.se/rss/", name: "di.se" },
      {
        url: "http://www.sydsvenskan.se/rss.xml?type=section&id=528225",
        name: "Sydsvenskan",
      },
    ],
  },
  {
    code: "NO",
    name: "Norway",
    lat: 60.5,
    lng: 8.5,
    gl: "NO",
    ceid: "NO:no",
    hl: "no",
    fallbackFeeds: [
      {
        url: "http://www.vg.no/rss/feed/?limit=10&format=rss&categories=&keywords=",
        name: "VG Nett",
      },
      { url: "https://www.nrk.no/nyheter/siste.rss", name: "NRK" },
      { url: "http://www.tv2.no/rss/tv2nyhetene-siste.xml", name: "TV2" },
      { url: "http://www.aftenposten.no/rss/", name: "Aftenposten" },
      { url: "http://e24.no/rss/", name: "E24" },
    ],
  },
  {
    code: "CZ",
    name: "Czechia",
    lat: 49.8,
    lng: 15.5,
    gl: "CZ",
    ceid: "CZ:cs",
    hl: "cs",
    fallbackFeeds: [
      { url: "http://www.novinky.cz/rss/", name: "Novinky.cz" },
      { url: "http://www.super.cz/rss2/", name: "Super.cz" },
      { url: "http://www.sport.cz/rss2/", name: "Sport.cz" },
      { url: "http://www.blesk.cz/rss/", name: "Blesk.cz" },
      { url: "http://zpravy.aktualne.cz/rss/", name: "Aktualne.cz" },
    ],
  },
  {
    code: "SK",
    name: "Slovakia",
    lat: 48.7,
    lng: 19.7,
    gl: "SK",
    ceid: "SK:sk",
    hl: "sk",
    fallbackFeeds: [
      { url: "http://www.aktuality.sk/rss/", name: "Aktuality.sk" },
      { url: "http://servis.pravda.sk/rss.asp", name: "Pravda.sk" },
      { url: "http://www.pluska.sk/rss.xml", name: "Pluska.sk" },
      { url: "http://hnonline.sk/rss/1", name: "HNonline.sk" },
      { url: "http://openiazoch.zoznam.sk/rss.asp", name: "oPeniazoch.sk" },
    ],
  },
  {
    code: "HU",
    name: "Hungary",
    lat: 47.2,
    lng: 19.5,
    gl: "HU",
    ceid: "HU:hu",
    hl: "hu",
    fallbackFeeds: [
      { url: "http://index.hu/24ora/rss", name: "Index" },
      { url: "http://hvg.hu/rss", name: "hvg.hu" },
      { url: "http://www.blikk.hu/rss/blikk", name: "Blikk" },
      { url: "http://velvet.hu/24ora/rss/", name: "Velvet" },
      { url: "http://sportgeza.hu/24ora/rss/", name: "Sport Geza" },
    ],
  },
  {
    code: "RO",
    name: "Romania",
    lat: 45.9,
    lng: 24.9,
    gl: "RO",
    ceid: "RO:ro",
    hl: "ro",
    fallbackFeeds: [
      { url: "http://adevarul.ro/rss/", name: "adevarul.ro" },
      { url: "http://rss.realitatea.net/stiri.xml", name: "Realitatea.net" },
      { url: "http://rss.stirileprotv.ro/", name: "Stirile Pro TV" },
      { url: "http://www.ziare.com/rss/actualitate.xml", name: "Ziare.com" },
      { url: "http://jurnalul.ro/rss", name: "jurnalul.ro" },
    ],
  },
  {
    code: "BG",
    name: "Bulgaria",
    lat: 42.7,
    lng: 25.5,
    gl: "BG",
    ceid: "BG:bg",
    hl: "bg",
    fallbackFeeds: [
      { url: "http://dnes.dir.bg/support/cat_rss.php", name: "Dnes Dir.bg" },
      { url: "http://www.dnes.bg/rss.php?today", name: "Dnes.bg" },
      { url: "http://dariknews.bg/rss.php", name: "Darik News" },
      { url: "http://www.24chasa.bg/RSS.asp", name: "24 Chasa" },
      { url: "http://www.dnevnik.bg/rss/", name: "Dnevnik" },
    ],
  },
  {
    code: "RS",
    name: "Serbia",
    lat: 44.0,
    lng: 21.0,
    gl: "RS",
    ceid: "RS:sr",
    hl: "sr",
    fallbackFeeds: [
      { url: "http://www.blic.rs/rss/danasnje-vesti", name: "Blic" },
      { url: "http://www.kurir-info.rs/rss/zabava/", name: "Kurir" },
      { url: "http://www.novosti.rs/rss/rss-vesti", name: "Novosti" },
      { url: "https://www.rts.rs/vesti/rss.html", name: "RTS" },
      {
        url: "http://crittendenpress.blogspot.com/feeds/posts/default?alt=rss",
        name: "Press Online",
      },
    ],
  },
  {
    code: "SI",
    name: "Slovenia",
    lat: 46.2,
    lng: 15.0,
    gl: "SI",
    ceid: "SI:sl",
    hl: "sl",
    fallbackFeeds: [
      {
        url: "http://www.siol.net/rss.aspx?path=SiOL.Net",
        name: "Planet Siol.net",
      },
      { url: "http://www.rtvslo.si/feeds/01.xml", name: "MMC RTV Slovenija" },
      { url: "http://www.delo.si/rss/", name: "Delo" },
      { url: "http://www.slovenskenovice.si/rss", name: "Slovenske novice" },
    ],
  },
  {
    code: "LV",
    name: "Latvia",
    lat: 56.9,
    lng: 24.6,
    gl: "LV",
    ceid: "LV:lv",
    hl: "lv",
    fallbackFeeds: [
      { url: "http://www.delfi.lv/rss.php", name: "DELFI" },
      { url: "http://www.gorod.lv/rss-news.php", name: "Gorod.lv" },
    ],
  },
  {
    code: "LT",
    name: "Lithuania",
    lat: 55.2,
    lng: 23.9,
    gl: "LT",
    ceid: "LT:lt",
    hl: "lt",
    fallbackFeeds: [
      { url: "http://www.delfi.lt/rss/feeds/lithuania.xml", name: "DELFI" },
      { url: "http://www.lrytas.lt/rss/", name: "Lietuvos Rytas" },
      { url: "http://www.15min.lt/rss", name: "15min.lt" },
    ],
  },
  {
    code: "GR",
    name: "Greece",
    lat: 39.1,
    lng: 21.8,
    gl: "GR",
    ceid: "GR:el",
    hl: "el",
    fallbackFeeds: [
      {
        url: "http://rss.in.gr/Netvolution.Site.Engine.PageHandler.axd?rid=2&pid=250&la=1&si=1",
        name: "in.gr",
      },
      { url: "http://feeds.feedburner.com/newsbombgr", name: "Newsbomb.gr" },
      { url: "http://www.newsit.gr/rss/artrss.php", name: "NewsIt.gr" },
      {
        url: "http://www.protothema.gr/rss/news/general/",
        name: "Proto Thema",
      },
      { url: "http://www.tanea.gr/rss.axd?pgid=1", name: "Ta Nea" },
    ],
  },
  {
    code: "LB",
    name: "Lebanon",
    lat: 33.9,
    lng: 35.9,
    gl: "LB",
    ceid: "LB:ar",
    hl: "ar",
  },
  {
    code: "MA",
    name: "Morocco",
    lat: 31.8,
    lng: -7.1,
    gl: "MA",
    ceid: "MA:fr",
    hl: "fr",
    fallbackFeeds: [
      { url: "http://www.hespress.com/feed/index.rss", name: "Hespress" },
      { url: "http://www.yabiladi.com/rss/?url=rubrik/", name: "yabiladi.com" },
      { url: "http://www.elbotola.com/feeds/", name: "Elbotola.com" },
      { url: "http://hihi2.com/feed", name: "hihi2" },
    ],
  },
  {
    code: "TR",
    name: "Turkey",
    lat: 39.0,
    lng: 35.2,
    gl: "TR",
    ceid: "TR:tr",
    hl: "tr",
    fallbackFeeds: [
      { url: "http://www.gazetevatan.com/rss/gundem.xml", name: "Vatan" },
      { url: "http://www.sabah.com.tr/rss/anasayfa.xml", name: "Sabah" },
      { url: "http://www.mynet.com/haber/rss/sondakika", name: "mynet haber" },
      { url: "http://www.haberturk.com/haberturk.xml", name: "Haber Turk" },
      { url: "http://sondakika.haber7.com/sondakika.rss", name: "haber7.com" },
    ],
  },
  {
    code: "GH",
    name: "Ghana",
    lat: 7.9,
    lng: -1.0,
    gl: "GH",
    ceid: "GH:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://www.ghanamma.com/category/business/feed/",
        name: "Ghana MMA",
      },
    ],
  },
  {
    code: "ET",
    name: "Ethiopia",
    lat: 9.1,
    lng: 40.5,
    gl: "ET",
    ceid: "ET:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://amharic.voanews.com/podcast/", name: "VOA" },
    ],
  },
  {
    code: "TZ",
    name: "Tanzania",
    lat: -6.4,
    lng: 34.9,
    gl: "TZ",
    ceid: "TZ:en",
    hl: "en",
  },
  {
    code: "UG",
    name: "Uganda",
    lat: 1.4,
    lng: 32.3,
    gl: "UG",
    ceid: "UG:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://feeds.feedburner.com/Bigeyeug", name: "BigEye.ug" },
    ],
  },
  {
    code: "ZW",
    name: "Zimbabwe",
    lat: -19.0,
    lng: 29.2,
    gl: "ZW",
    ceid: "ZW:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://www.herald.co.zw/feed/", name: "Herald" },
      {
        url: "http://allafrica.com/tools/headlines/rdf/zimbabwe/headlines.rdf",
        name: "Zimbabwe Independent",
      },
      { url: "http://thestandard.org.nz/feed/", name: "Standard" },
      { url: "http://www.zimeye.org/feed/", name: "ZimEye" },
    ],
  },
  {
    code: "BW",
    name: "Botswana",
    lat: -22.3,
    lng: 24.7,
    gl: "BW",
    ceid: "BW:en",
    hl: "en",
  },
  {
    code: "NA",
    name: "Namibia",
    lat: -23.0,
    lng: 18.5,
    gl: "NA",
    ceid: "NA:en",
    hl: "en",
    fallbackFeeds: [
      { url: "http://feeds.nbcnews.com/feeds/topstories", name: "NBC" },
    ],
  },
  {
    code: "SN",
    name: "Senegal",
    lat: 14.5,
    lng: -14.5,
    gl: "SN",
    ceid: "SN:fr",
    hl: "fr",
    fallbackFeeds: [
      { url: "http://www.leral.net/xml/syndication.rss", name: "leral.net" },
      { url: "http://senego.com/feed", name: "Senego" },
      {
        url: "http://xalimasn.com/une-refutation-des-theses-de-lanimateur-tekhe-gaye-et-autres-porte-propagandes-sur-les-supposes-60-milliards-de-aliou-sall/feed/",
        name: "Xalimasn.com",
      },
      {
        url: "http://www.sanslimitesn.com/tag/exclusivite-pressafrik-com/feed/",
        name: "PressAfrik",
      },
      { url: "http://www.wiwsport.com/rss/fluxrss.xml", name: "WIW Sport" },
    ],
  },
  {
    code: "PK",
    name: "Pakistan",
    lat: 30.4,
    lng: 69.3,
    gl: "PK",
    ceid: "PK:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://feeds.feedburner.com/daily-express-news-showbiz",
        name: "Daily Express",
      },
      { url: "http://www.pakistantoday.com.pk/feed/", name: "Pakistan Today" },
      { url: "http://www.dailytimes.com.pk/rss_feeds", name: "Daily Times" },
      { url: "https://tribune.com.pk/feed/home", name: "The Express Tribune" },
      {
        url: "https://nation.com.pk/rss/top-stories",
        name: "The Nation - Top Stories",
      },
    ],
  },
  {
    code: "BD",
    name: "Bangladesh",
    lat: 23.7,
    lng: 90.4,
    gl: "BD",
    ceid: "BD:bn",
    hl: "bn",
    fallbackFeeds: [
      { url: "http://www.kalerkantho.com/rss.xml", name: "Kalerkantho.com" },
      {
        url: "https://www.jagonews24.com/rss/rss.xml",
        name: "jagonews24.com | rss Feed",
      },
      {
        url: "https://www.kalerkantho.com/rss.xml",
        name: "kalerkantho Kantho",
      },
      { url: "https://www.prothomalo.com/feed/", name: "প্রথম আলো" },
    ],
  },
  {
    code: "MY",
    name: "Malaysia",
    lat: 4.2,
    lng: 101.9,
    gl: "MY",
    ceid: "MY:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://www.thestar.com.my/RSS/News/Nation/",
        name: "The Star online",
      },
      { url: "http://www.hmetro.com.my/utama.xml", name: "myMetro" },
      {
        url: "http://www.bharian.com.my/terkini.xml",
        name: "BH Berita Harian",
      },
      { url: "http://thebusinesstimes.com/feed/", name: "Business Times" },
    ],
  },
  {
    code: "VN",
    name: "Vietnam",
    lat: 14.1,
    lng: 108.3,
    gl: "VN",
    ceid: "VN:vi",
    hl: "vi",
    fallbackFeeds: [
      { url: "http://vnexpress.net/rss/kinh-doanh.rss", name: "VnExpress" },
      { url: "http://www.tinmoi.vn/rss/Tin-tuc.rss", name: "tinmoi" },
    ],
  },
  {
    code: "HK",
    name: "Hong Kong",
    lat: 22.3,
    lng: 114.2,
    gl: "HK",
    ceid: "HK:zh-Hant",
    hl: "zh-HK",
    fallbackFeeds: [
      {
        url: "http://feeds.feedburner.com/123greetings-daily-rss",
        name: "Orient Daily",
      },
      { url: "http://startupbeat.hkej.com/?feed=rss2", name: "HKEJ" },
      {
        url: "https://www.hongkongfp.com/feed/",
        name: "Hong Kong Free Press HKFP",
      },
      {
        url: "https://www.hket.com/rss/hongkong",
        name: "香港新聞RSS - 香港經濟日報 hket.com",
      },
      {
        url: "http://feeds.hongkongnews.net/rss/b82693edf38ebff8",
        name: "hongkongnews.net latest rss headlines",
      },
    ],
  },
  {
    code: "NZ",
    name: "New Zealand",
    lat: -40.9,
    lng: 174.9,
    gl: "NZ",
    ceid: "NZ:en",
    hl: "en",
    fallbackFeeds: [
      {
        url: "http://rss.nzherald.co.nz/rss/xml/nzhrsscid_000000001.xml",
        name: "NZ Herald",
      },
      { url: "http://www.odt.co.nz/news/feed", name: "Otago Daily Times" },
    ],
  },
  {
    code: "CL",
    name: "Chile",
    lat: -35.7,
    lng: -71.5,
    gl: "CL",
    ceid: "CL:es-419",
    hl: "es-419",
    fallbackFeeds: [
      {
        url: "https://feeds.feedburner.com/radiobiobio/NNeJ",
        name: "BioBioChile",
      },
      { url: "https://www.theclinic.cl/feed/", name: "The Clinic" },
      {
        url: "https://www.df.cl/noticias/site/list/port/rss.xml",
        name: "Diario Financiero",
      },
      {
        url: "https://www.publimetro.cl/arc/outboundfeeds/rss/?outputType=xml",
        name: "Publimetro",
      },
      { url: "https://elsiglo.cl/feed/", name: "El Siglo" },
    ],
  },
  {
    code: "PE",
    name: "Peru",
    lat: -9.2,
    lng: -75.0,
    gl: "PE",
    ceid: "PE:es-419",
    hl: "es-419",
    fallbackFeeds: [
      {
        url: "https://elcomercio.pe/arc/outboundfeeds/rss/?outputType=xml",
        name: "El Comercio Perú",
      },
      {
        url: "https://gestion.pe/arc/outboundfeeds/rss/?outputType=xml",
        name: "Gestión",
      },
      {
        url: "https://trome.com/arc/outboundfeeds/rss/?outputType=xml",
        name: "Trome",
      },
      { url: "https://larepublica.pe/rss/home.xml", name: "La República" },
      {
        url: "https://diariocorreo.pe/arc/outboundfeeds/rss/?outputType=xml",
        name: "Diario Correo",
      },
    ],
  },
  {
    code: "VE",
    name: "Venezuela",
    lat: 6.4,
    lng: -66.6,
    gl: "VE",
    ceid: "VE:es-419",
    hl: "es-419",
    fallbackFeeds: [
      { url: "http://www.el-nacional.com/rss/", name: "El Nacional" },
      { url: "http://feeds.feedburner.com/aporrea/noticias", name: "Aporrea" },
    ],
  },
  {
    code: "CU",
    name: "Cuba",
    lat: 21.5,
    lng: -77.8,
    gl: "CU",
    ceid: "CU:es-419",
    hl: "es-419",
    fallbackFeeds: [
      { url: "http://www.cubanet.org/feed/", name: "CubaNet" },
      { url: "http://www.diariodecuba.com/rss.xml", name: "Diario de Cuba" },
      {
        url: "http://www.martinoticias.com/podcast/video.aspx?count=20&zoneId=128",
        name: "Marti",
      },
      { url: "http://www.laprensalatina.com/feed/", name: "Prensa latina" },
    ],
  },

  // --- Fallback-only countries (direct RSS feeds, enriched from upstream) ---
  {
    code: "AD",
    name: "Andorra",
    lat: 42.5,
    lng: 1.5,
    fallbackFeeds: [{ url: "http://www.bondia.ad/rss.xml", name: "Diari Més" }],
  },
  {
    code: "AF",
    name: "Afghanistan",
    lat: 33.9,
    lng: 67.7,
    fallbackFeeds: [
      { url: "http://pa.azadiradio.org/api/epiqq", name: "Azadi Radio Pashto" },
    ],
  },
  {
    code: "AL",
    name: "Albania",
    lat: 41.2,
    lng: 20.2,
    fallbackFeeds: [
      { url: "http://www.balkanweb.com/site/feed/", name: "BalkanWeb" },
    ],
  },
  {
    code: "AM",
    name: "Armenia",
    lat: 40.1,
    lng: 45.0,
    fallbackFeeds: [
      { url: "http://news.am/eng/rss/", name: "News.am" },
      { url: "http://en.1in.am/feed", name: "1in.am" },
      { url: "http://en.aravot.am/feed/", name: "Aravot" },
    ],
  },
  {
    code: "AZ",
    name: "Azerbaijan",
    lat: 40.1,
    lng: 47.6,
    fallbackFeeds: [
      { url: "http://news.day.az/rss/all.rss", name: "Day.az" },
      { url: "http://en.trend.az/feeds/index.rss", name: "Trend" },
      { url: "http://www.azadliq.org/api/aororegtor", name: "Azadliq Radiosu" },
    ],
  },
  {
    code: "BA",
    name: "Bosnia and Herzegovina",
    lat: 43.9,
    lng: 17.7,
    fallbackFeeds: [
      { url: "http://www.dnevnik.ba/rss.xml", name: "Dnevnik.ba" },
    ],
  },
  {
    code: "BB",
    name: "Barbados",
    lat: 13.2,
    lng: -59.5,
    fallbackFeeds: [
      { url: "http://www.nationnews.com/feed/rss", name: "Nation News" },
      { url: "http://www.barbadostoday.bb/feed/", name: "Barbados Today" },
    ],
  },
  {
    code: "BI",
    name: "Burundi",
    lat: -3.4,
    lng: 29.9,
    fallbackFeeds: [
      { url: "http://www.iwacu-burundi.org/feed/", name: "IWACU" },
    ],
  },
  {
    code: "BJ",
    name: "Benin",
    lat: 9.3,
    lng: 2.3,
    fallbackFeeds: [
      {
        url: "http://mediaf.org/?feed=rss2&tag=charles-honvoh-adjinakou",
        name: "Adjinakou",
      },
    ],
  },
  {
    code: "BM",
    name: "Bermuda",
    lat: 32.3,
    lng: -64.8,
    fallbackFeeds: [
      { url: "http://bernews.com/tag/rory-field/feed/", name: "Bernews" },
    ],
  },
  {
    code: "BO",
    name: "Bolivia",
    lat: -16.3,
    lng: -63.6,
    fallbackFeeds: [
      { url: "https://larazon.bo/feed/", name: "La Razón" },
      { url: "https://www.opinion.com.bo/rss/", name: "Opinion" },
      { url: "https://radiofides.com/es/feed/", name: "Radio Fides" },
    ],
  },
  {
    code: "BS",
    name: "Bahamas",
    lat: 25.0,
    lng: -77.4,
    fallbackFeeds: [
      { url: "http://bahamaspress.com/feed/", name: "Bahamas Press" },
    ],
  },
  {
    code: "BY",
    name: "Belarus",
    lat: 53.7,
    lng: 27.6,
    fallbackFeeds: [
      { url: "http://nn.by/?c=rss-all&lang=en", name: "Nasha Niva" },
    ],
  },
  {
    code: "BZ",
    name: "Belize",
    lat: 17.2,
    lng: -88.5,
    fallbackFeeds: [
      { url: "http://amandala.com.bz/news/feed/", name: "Amandala" },
    ],
  },
  {
    code: "CD",
    name: "DR Congo",
    lat: -4.0,
    lng: 21.8,
    fallbackFeeds: [
      {
        url: "http://www.congoplanet.com/feeds/rss_congo_africa.xml",
        name: "Congo Planet",
      },
    ],
  },
  {
    code: "CM",
    name: "Cameroon",
    lat: 7.4,
    lng: 12.4,
    fallbackFeeds: [
      {
        url: "http://allafrica.com/tools/headlines/rdf/cameroon/headlines.rdf",
        name: "AllAfrica Cameroon",
      },
    ],
  },
  {
    code: "CR",
    name: "Costa Rica",
    lat: 9.7,
    lng: -83.8,
    fallbackFeeds: [
      { url: "http://www.elfinancierocr.com/rss/", name: "El Financiero" },
    ],
  },
  {
    code: "CY",
    name: "Cyprus",
    lat: 35.1,
    lng: 33.4,
    fallbackFeeds: [
      { url: "http://cyprus-mail.com/feed/", name: "Cyprus Mail" },
      { url: "http://www.sigmalive.com/rss", name: "Sigma Live" },
    ],
  },
  {
    code: "DJ",
    name: "Djibouti",
    lat: 11.8,
    lng: 42.6,
    fallbackFeeds: [{ url: "http://www.nacion.com/rss/", name: "La Nacion" }],
  },
  {
    code: "DK",
    name: "Denmark",
    lat: 56.3,
    lng: 9.5,
    fallbackFeeds: [{ url: "http://borsen.dk/rss/", name: "Børsen" }],
  },
  {
    code: "DM",
    name: "Dominica",
    lat: 15.4,
    lng: -61.4,
    fallbackFeeds: [
      {
        url: "http://dominicanewsonline.com/news/feed/",
        name: "Dominica News",
      },
    ],
  },
  {
    code: "DO",
    name: "Dominican Republic",
    lat: 18.7,
    lng: -70.2,
    fallbackFeeds: [
      { url: "http://almomento.net/feed/", name: "Almomento.net" },
      { url: "http://acento.com/feed/", name: "Acento" },
    ],
  },
  {
    code: "DZ",
    name: "Algeria",
    lat: 28.0,
    lng: 1.7,
    fallbackFeeds: [
      { url: "http://www.algerie360.com/feed/", name: "Algerie360" },
      { url: "http://elkhadra.com/fr/feed/", name: "El Khadra" },
      { url: "http://www.tsa-algerie.com/feed/", name: "TSA" },
    ],
  },
  {
    code: "EC",
    name: "Ecuador",
    lat: -1.8,
    lng: -78.2,
    fallbackFeeds: [
      { url: "https://www.elcomercio.com/feed/", name: "El Comercio" },
      { url: "https://gk.city/feed/", name: "GK City" },
    ],
  },
  {
    code: "EE",
    name: "Estonia",
    lat: 58.6,
    lng: 25.0,
    fallbackFeeds: [{ url: "http://www.postimees.ee/rss/", name: "Postimees" }],
  },
  {
    code: "ER",
    name: "Eritrea",
    lat: 15.2,
    lng: 39.8,
    fallbackFeeds: [
      {
        url: "http://asmarino.com/?format=feed&type=rss",
        name: "Asmarino Independent",
      },
    ],
  },
  {
    code: "FI",
    name: "Finland",
    lat: 61.9,
    lng: 25.7,
    fallbackFeeds: [
      { url: "http://yle.fi/uutiset/rss/uutiset.rss?osasto=news", name: "YLE" },
      { url: "http://www.iltalehti.fi/rss/uutiset.xml", name: "Iltalehti" },
    ],
  },
  {
    code: "FO",
    name: "Faroe Islands",
    lat: 61.9,
    lng: -6.9,
    fallbackFeeds: [
      { url: "http://www.npr.org/rss/podcast.php?id=510289", name: "PLANET" },
    ],
  },
  {
    code: "GA",
    name: "Gabon",
    lat: -0.8,
    lng: 11.6,
    fallbackFeeds: [
      { url: "http://fr.infosgabon.com/feed/", name: "Infos Gabon" },
    ],
  },
  {
    code: "GM",
    name: "Gambia",
    lat: 13.4,
    lng: -15.3,
    fallbackFeeds: [{ url: "http://thepoint.gm/posts/rss/xml", name: "Point" }],
  },
  {
    code: "GN",
    name: "Guinea",
    lat: 9.9,
    lng: -11.8,
    fallbackFeeds: [{ url: "http://guineenews.org/feed/", name: "Guineenews" }],
  },
  {
    code: "GT",
    name: "Guatemala",
    lat: 15.8,
    lng: -90.2,
    fallbackFeeds: [
      { url: "http://www.plazapublica.com.gt/rss", name: "Plaza Publica" },
    ],
  },
  {
    code: "GY",
    name: "Guyana",
    lat: 5.0,
    lng: -59.0,
    fallbackFeeds: [
      { url: "http://www.kaieteurnewsonline.com/feed/", name: "Kaieteur News" },
    ],
  },
  {
    code: "HR",
    name: "Croatia",
    lat: 45.1,
    lng: 15.2,
    fallbackFeeds: [
      { url: "http://www.24sata.hr/feeds/news.xml", name: "24sata" },
      { url: "http://www.tportal.hr/rss/naslovnicarss.xml", name: "tportal" },
    ],
  },
  {
    code: "HT",
    name: "Haiti",
    lat: 19.1,
    lng: -72.3,
    fallbackFeeds: [
      {
        url: "http://www.haitilibre.com/rss-flash-en.xml",
        name: "Haiti Libre",
      },
    ],
  },
  {
    code: "IQ",
    name: "Iraq",
    lat: 33.2,
    lng: 43.7,
    fallbackFeeds: [
      { url: "http://www.ahewar.org/rss/default.asp?lt=7", name: "Ahewar" },
    ],
  },
  {
    code: "IR",
    name: "Iran",
    lat: 32.4,
    lng: 53.7,
    fallbackFeeds: [
      { url: "http://english.khabaronline.ir/rss/", name: "Khabar Online" },
      { url: "http://www.radiofarda.com/api/", name: "Radio Farda" },
      { url: "http://www.mehrnews.com/rss", name: "Mehr News" },
    ],
  },
  {
    code: "IS",
    name: "Iceland",
    lat: 64.1,
    lng: -21.9,
    fallbackFeeds: [
      { url: "http://www.mbl.is/mbl-frettir-forsida", name: "mbl.is" },
      { url: "http://www.ruv.is/rss/frettir", name: "RUV" },
    ],
  },
  {
    code: "JM",
    name: "Jamaica",
    lat: 18.1,
    lng: -77.3,
    fallbackFeeds: [
      {
        url: "http://jamaica-gleaner.com/feed/rss.xml",
        name: "Jamaica Gleaner",
      },
      { url: "http://jamaica-star.com/feed/news.xml", name: "Jamaica Star" },
    ],
  },
  {
    code: "JO",
    name: "Jordan",
    lat: 30.6,
    lng: 36.2,
    fallbackFeeds: [
      { url: "http://www.jordanzad.com/rss.php?type=main", name: "Jordan Zad" },
    ],
  },
  {
    code: "KG",
    name: "Kyrgyzstan",
    lat: 41.2,
    lng: 74.8,
    fallbackFeeds: [
      { url: "http://www.akipress.com/rss/en.rss", name: "AKIpress" },
      { url: "http://www.tazabek.kg/rss/news.rss", name: "Tazabek" },
    ],
  },
  {
    code: "KH",
    name: "Cambodia",
    lat: 12.6,
    lng: 105.0,
    fallbackFeeds: [
      { url: "http://www.khmer.rfi.fr/cambodia/rss", name: "RFI Khmer" },
    ],
  },
  {
    code: "KZ",
    name: "Kazakhstan",
    lat: 48.0,
    lng: 68.0,
    fallbackFeeds: [
      { url: "http://tengrinews.kz/news.rss", name: "Tengri News" },
      { url: "http://www.kt.kz/kaz/rss/", name: "Kazakhstan Today" },
    ],
  },
  {
    code: "LK",
    name: "Sri Lanka",
    lat: 7.9,
    lng: 80.8,
    fallbackFeeds: [
      {
        url: "http://www.lankahotnews.net/feeds/posts/default?alt=rss",
        name: "Lanka Hot News",
      },
    ],
  },
  {
    code: "LR",
    name: "Liberia",
    lat: 6.4,
    lng: -9.4,
    fallbackFeeds: [
      { url: "http://www.newrepublic.com/rss.xml", name: "New Republic" },
    ],
  },
  {
    code: "LU",
    name: "Luxembourg",
    lat: 49.8,
    lng: 6.1,
    fallbackFeeds: [{ url: "http://rtl.lu/rss/headlines/", name: "RTL" }],
  },
  {
    code: "LY",
    name: "Libya",
    lat: 26.3,
    lng: 17.2,
    fallbackFeeds: [
      { url: "http://www.tripolipost.com/rss.xml", name: "Tripoli Post" },
    ],
  },
  {
    code: "MC",
    name: "Monaco",
    lat: 43.7,
    lng: 7.4,
    fallbackFeeds: [
      {
        url: "http://www.montecarlonews.it/links/rss/argomenti/matrimonio-del-principe/rss.xml",
        name: "MonteCarloNews",
      },
    ],
  },
  {
    code: "MD",
    name: "Moldova",
    lat: 47.4,
    lng: 28.4,
    fallbackFeeds: [
      { url: "http://point.md/ru/rss/novosti/", name: "Point" },
      { url: "http://www.timpul.md/rss", name: "Timpul" },
      { url: "https://www.zdg.md/feed/atom/", name: "Ziarul de Gardă" },
    ],
  },
  {
    code: "ME",
    name: "Montenegro",
    lat: 42.7,
    lng: 19.4,
    fallbackFeeds: [
      { url: "https://www.vijesti.me/rss", name: "Vijesti" },
      { url: "https://www.cdm.me/feed/", name: "CDM" },
    ],
  },
  {
    code: "MG",
    name: "Madagascar",
    lat: -18.8,
    lng: 46.9,
    fallbackFeeds: [
      {
        url: "http://www.madagascar-tribune.com/spip.php?page=backend",
        name: "Madagascar Tribune",
      },
    ],
  },
  {
    code: "MK",
    name: "North Macedonia",
    lat: 41.5,
    lng: 21.7,
    fallbackFeeds: [{ url: "http://www.mkd.mk/feed", name: "MKD" }],
  },
  {
    code: "ML",
    name: "Mali",
    lat: 17.6,
    lng: -4.0,
    fallbackFeeds: [
      { url: "http://www.journaldumali.com/rss/", name: "Journal du Mali" },
    ],
  },
  {
    code: "MM",
    name: "Myanmar",
    lat: 21.9,
    lng: 95.9,
    fallbackFeeds: [
      { url: "http://www.irrawaddy.org/feed", name: "The Irrawaddy" },
      { url: "http://myanmargazette.net/feed", name: "Myanmar Gazette" },
    ],
  },
  {
    code: "MN",
    name: "Mongolia",
    lat: 46.9,
    lng: 103.8,
    fallbackFeeds: [{ url: "http://www.bolod.mn/feed.php", name: "Bolod.mn" }],
  },
  {
    code: "MT",
    name: "Malta",
    lat: 35.9,
    lng: 14.4,
    fallbackFeeds: [
      { url: "http://www.maltatoday.com.mt/rss/", name: "Malta Today" },
      { url: "http://feed.gozonews.com/GozoNews", name: "Gozo News" },
    ],
  },
  {
    code: "MU",
    name: "Mauritius",
    lat: -20.3,
    lng: 57.6,
    fallbackFeeds: [
      { url: "http://www.lexpress.mu/rss.xml", name: "L'Express" },
    ],
  },
  {
    code: "MV",
    name: "Maldives",
    lat: 3.2,
    lng: 73.2,
    fallbackFeeds: [{ url: "http://sun.mv/feed/", name: "Sun.mv" }],
  },
  {
    code: "MW",
    name: "Malawi",
    lat: -13.3,
    lng: 34.3,
    fallbackFeeds: [
      { url: "http://www.nyasatimes.com/feed/", name: "Nyasa Times" },
      { url: "http://www.malawivoice.com/feed/", name: "Malawi Voice" },
    ],
  },
  {
    code: "NE",
    name: "Niger",
    lat: 17.6,
    lng: 8.1,
    fallbackFeeds: [
      { url: "http://www.tamtaminfo.com/feed/", name: "Tam Tam Info" },
    ],
  },
  {
    code: "NI",
    name: "Nicaragua",
    lat: 12.9,
    lng: -85.2,
    fallbackFeeds: [
      { url: "http://nuevaya.com.ni/feed/", name: "La Nueva Radio YA" },
    ],
  },
  {
    code: "NP",
    name: "Nepal",
    lat: 28.4,
    lng: 84.1,
    fallbackFeeds: [
      { url: "http://www.onlinekhabar.com/feed/", name: "Online Khabar" },
    ],
  },
  { code: "PA", name: "Panama", lat: 8.5, lng: -80.8, fallbackFeeds: [] },
  {
    code: "PR",
    name: "Puerto Rico",
    lat: 18.2,
    lng: -66.6,
    fallbackFeeds: [{ url: "http://noticel.com/feed", name: "NotiCel" }],
  },
  {
    code: "PS",
    name: "Palestine",
    lat: 31.9,
    lng: 35.2,
    fallbackFeeds: [
      { url: "http://www.nablustv.net/xml.asp", name: "Nablus TV" },
    ],
  },
  {
    code: "SB",
    name: "Solomon Islands",
    lat: -9.6,
    lng: 160.2,
    fallbackFeeds: [
      {
        url: "http://www.solomontimes.com/rss/latest-news.xml",
        name: "Solomon Times",
      },
    ],
  },
  { code: "SL", name: "Sierra Leone", lat: 8.5, lng: -11.8, fallbackFeeds: [] },
  {
    code: "SM",
    name: "San Marino",
    lat: 43.9,
    lng: 12.5,
    fallbackFeeds: [
      { url: "http://giornalesm.com/feed/", name: "Giornale.sm" },
    ],
  },
  {
    code: "SO",
    name: "Somalia",
    lat: 5.2,
    lng: 46.2,
    fallbackFeeds: [
      { url: "http://www.jowhar.com/?feed=rss2&author=1", name: "Jowhar" },
      { url: "http://www.voasomali.com/api/", name: "VOA Somali" },
    ],
  },
  {
    code: "SR",
    name: "Suriname",
    lat: 3.9,
    lng: -56.0,
    fallbackFeeds: [
      {
        url: "http://www.starnieuws.com/rss/starnieuws.rss",
        name: "Starnieuws",
      },
      { url: "http://www.waterkant.net/feed/", name: "Waterkant" },
    ],
  },
  {
    code: "SY",
    name: "Syria",
    lat: 34.8,
    lng: 38.9,
    fallbackFeeds: [{ url: "http://www.sana.sy/tr/?feed=rss2", name: "SANA" }],
  },
  {
    code: "TG",
    name: "Togo",
    lat: 8.6,
    lng: 1.2,
    fallbackFeeds: [
      {
        url: "http://feeds2.feedburner.com/Actualite_Togo",
        name: "Jeune Afrique Togo",
      },
    ],
  },
  {
    code: "TN",
    name: "Tunisia",
    lat: 33.9,
    lng: 9.5,
    fallbackFeeds: [{ url: "http://www.leaders.com.tn/rss", name: "Leaders" }],
  },
  {
    code: "UY",
    name: "Uruguay",
    lat: -32.5,
    lng: -55.8,
    fallbackFeeds: [
      {
        url: "https://www.elobservador.com.uy/rss/pages/ultimo-momento.xml",
        name: "El Observador",
      },
      { url: "https://ladiaria.com.uy/feeds/articulos", name: "La Diaria" },
    ],
  },
  {
    code: "UZ",
    name: "Uzbekistan",
    lat: 41.4,
    lng: 64.6,
    fallbackFeeds: [{ url: "http://www.gazeta.uz/rss/", name: "Gazeta.uz" }],
  },
  {
    code: "WS",
    name: "Samoa",
    lat: -13.8,
    lng: -172.1,
    fallbackFeeds: [
      { url: "http://www.samoanews.com/?q=rss.xml", name: "Samoa News" },
    ],
  },
  {
    code: "XK",
    name: "Kosovo",
    lat: 42.6,
    lng: 20.9,
    fallbackFeeds: [
      { url: "https://www.rtklive.com/sq/feed/", name: "RTK Live" },
      { url: "https://zeri.info/rss/zerat", name: "Zeri" },
    ],
  },
  {
    code: "YE",
    name: "Yemen",
    lat: 15.6,
    lng: 48.5,
    fallbackFeeds: [
      { url: "https://marebpress.net/news_rss.php", name: "Mareb Press" },
    ],
  },
  {
    code: "ZM",
    name: "Zambia",
    lat: -13.1,
    lng: 27.8,
    fallbackFeeds: [{ url: "http://tumfweko.com/feed/", name: "Tumfweko" }],
  },
];

// Lookup helpers
export const COUNTRY_BY_CODE = new Map(COUNTRIES.map((c) => [c.code, c]));
