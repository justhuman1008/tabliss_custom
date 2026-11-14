interface Engine {
  key: string;
  name: string;
  search_url: string;
  suggest_url?: string;
}

export const engines: Engine[] = [
  {
    key: "google",
    name: "Google",
    search_url: "https://www.google.com/search?q={searchTerms}",
    suggest_url:
      "https://www.google.com/complete/search?client=chrome&q={searchTerms}&callback={callback}",
  },
  {
    key: "bing",
    name: "Bing",
    search_url: "https://www.bing.com/search?q={searchTerms}",
    suggest_url:
      "https://api.bing.com/osjson.aspx?query={searchTerms}&JsonType=callback&JsonCallback={callback}",
  },
  {
    key: "duckduckgo",
    name: "DuckDuckGo",
    search_url: "https://duckduckgo.com/?q={searchTerms}",
  },
  {
    key: "brave",
    name: "Brave",
    search_url: "https://search.brave.com/search?q={searchTerms}",
  },
  {
    key: "naver",
    name: "Naver",
    search_url: "https://search.naver.com/search.naver?query={searchTerms}",
  },
  {
    key: "daum",
    name: "Daum",
    search_url: "https://search.daum.net/search?q={searchTerms}",
  },
];
