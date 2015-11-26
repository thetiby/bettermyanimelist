var LIST_TYPES_SEARCH = {0: "anime", 1: "manga", 2: "characters", 6: "people", 3: "fansub groups", 4: "clubs", 5: "users"};
var LIST_TYPES_ANIME = {TV: 1, OVA: 2, Movie: 3, Special: 4, ONA: 5, Music: 6};
var LIST_TYPES_MANGA = {Manga: 1, Novel: 2, "One Shot": 3, Doujin: 4, Manhwa: 5, Manhua: 6, OEL: 7};
var LIST_STATUS_ANIME = {1: "Watching", 2: "Completed", 3: "On-Hold", 6: "Plan to Watch", 4: "Dropped"};
var LIST_STATUS_MANGA = {1: "Reading", 2: "Completed", 3: "On-Hold", 6: "Plan to Read", 4: "Dropped"};

var URI_API_SEARCH = "/api/{type}/search.xml?q={query}";
var URI_API_LIST = "/malappinfo.php?u={username}&status=all&type={type}";
var URI_ADD_ANIME = "/panel.php?go=add&selected_series_id={id}&hideLayout";
var URI_ADD_MANGA = "/panel.php?go=addmanga&selected_manga_id={id}&hideLayout";
var URI_EDIT_ANIME = "/editlist.php?type=anime&id={id}&hideLayout";
var URI_EDIT_MANGA = "/panel.php?go=editmanga&id={id}&hideLayout";

var URL_API_GOOGLE_CSE = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&prettyPrint=false&cx=017838747860400341411:mrh0oq__z70&q=%22site%3A{url}%22%20{query}&filter=0";
var URL_WEBSITE = "http://bettermyanimelist.net";
var URL_FORUM = "http://bettermyanimelist.net/forum";

var TYPE_ANIME = 0;
var TYPE_MANGA = 1;

var DEBUG = true;