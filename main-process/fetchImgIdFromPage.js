const request = require("request");
const cheerio = require("cheerio");
const Q = require("jquery");
const store = require("./store");
var imglist = [], //抓取到的图片列表
  pageUrlForFetchImg =
    "https://alpha.wallhaven.cc/search?q=nature&search_image=&categories=110&purity=110&sorting=favorites&order=desc&page=",
  imgNumberInPage = 24, // 每页最多24张图片
  totalPages = 1600;

/**
 * 从页面中提取图片id
 * @returns
 */
function fetchImgIdFromPage() {
  var randomImgMsg = store.get("randomImgMsg");
  if (typeof randomImgMsg != "object" || randomImgMsg === null) {
    randomImgMsg = {
      page: 1,
      index: 1
    };
  }
  var url = pageUrlForFetchImg + randomImgMsg.page;
  return new Promise((re, rj) => {
    if (randomImgMsg.index == imgNumberInPage - 1) {
      store.set("randomImgMsg", {
        page: Math.min(randomImgMsg.page + 1, totalPages),
        index: 0
      });
      imglist = [];
    } else {
      store.set("randomImgMsg", {
        page: randomImgMsg.page,
        index: randomImgMsg.index + 1
      });
    }
    // 已经从页面中爬取了图片列表则直接返回相应的图片编号
    if (imglist.length > 0) {
      let imgid = splitIdFromPath(imglist[randomImgMsg.index + 1]);
      re(imgid);
      return;
    }
    // 抓取页面数据,获取到图片的id
    request(url, (err, data) => {
      if (err) {
        rj(err);
        return;
      }
      let $ = cheerio.load(data.body);
      $(".preview").each((ind, el) => {
        imglist.push($(el).attr("href"));
      });
      let imgid = splitIdFromPath(imglist[randomImgMsg.index]);
      re(imgid);
    });
  });
}

/**
 * 从路径中提取出图片id
 * @param {String} path
 * @returns
 */
function splitIdFromPath(path) {
  var s = path.split("/");
  return s[s.length - 1];
}

module.exports = fetchImgIdFromPage;
