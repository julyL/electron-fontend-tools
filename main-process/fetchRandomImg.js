const request = require("request");
const cheerio = require("cheerio");

function fetchRandomImg() {
  console.log("fetch");
  var url = "https://alpha.wallhaven.cc/wallpaper/2";
  return new Promise((re, rj) => {
    request(url, (err, data) => {
      if (err) {
        rj(err);
        return;
      }
      let $ = cheerio.load(data.body);
      console.log($("#wallpaper"));
    });
  });
}
module.export = fetchRandomImg;
