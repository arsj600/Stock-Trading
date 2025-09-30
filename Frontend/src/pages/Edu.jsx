import React from "react";

const youtubeVideos = [
  {
    id: "1",
    title: "Stock Market Basics 2025",
    url: "https://www.youtube.com/watch?v=Ay4fmZdZqJE",
    thumbnail: "https://img.youtube.com/vi/Ay4fmZdZqJE/maxresdefault.jpg",
  },
  {
    id: "2",
    title: "How To Get Started",
    url: "https://www.youtube.com/watch?v=a0_-xUE12ew",
    thumbnail: "https://img.youtube.com/vi/a0_-xUE12ew/maxresdefault.jpg",
  }, {
    id: "3",
    title: "The Ultimate Investing Guide",
    url: "https://www.youtube.com/watch?v=bb6_M_srMBk",
    thumbnail: "https://img.youtube.com/vi/bb6_M_srMBk/maxresdefault.jpg",
  },
  {
    id: "4",
    title: "How To Invest in 2025",
    url: "https://www.youtube.com/watch?v=EcJoZovSwZ8",
    thumbnail: "https://img.youtube.com/vi/EcJoZovSwZ8/maxresdefault.jpg",
  },
  {
    id: "5",
    title: "Learn How To Invest",
    url: "https://www.youtube.com/watch?v=Ao7WHrRw_VM",
    thumbnail: "https://img.youtube.com/vi/Ao7WHrRw_VM/maxresdefault.jpg",
  },
  {
    id: "6",
    title: "Complete Stock Market Basics for Beginners in Hindi",
    url: "https://www.youtube.com/watch?v=RFP3ooXIiyI",
    thumbnail: "https://img.youtube.com/vi/RFP3ooXIiyI/maxresdefault.jpg",
  }
];

const articles = [
  {
    id: "1",
    title: "Beginner’s Guide to Trading",
    url: "https://www.investopedia.com/articles/basics/06/invest1000.asp",
  },
  {
    id: "2",
    title: "Risk Management in Stock Trading",
    url: "https://www.investopedia.com/terms/r/riskmanagement.asp",
  }, {
    id: "3",
    title: "Learn How to Invest in Securities Market",
    url: "https://investor.sebi.gov.in/securities-howtoinvest.html",
  },
  {
    id: "4",
    title: "Reports On Nse",
    url: "https://www.nseindia.com/all-reports",
  },
 {
    id: "5",
    title: "The Basics of Investing In Stocks",
    url: "https://dfi.wa.gov/financial-education/information/basics-investing-stocks",
  },
  {
    id: "6",
    title: "Investment Tips for Beginners",
    url: "https://www.schwab.com/learn/story/stock-investment-tips-beginners",
  },


];

export function Edu() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📚 Education</h1>

      {/* YouTube Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">YouTube Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {youtubeVideos.map((video) => (
            <a
              key={video.id}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-72 object-cover"
              />
              <div className="p-4">
                <p className="font-medium">{video.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Articles Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📰 Articles</h2>
        <ul className="space-y-3">
          {articles.map((article) => (
            <li key={article.id}>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {article.title}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
