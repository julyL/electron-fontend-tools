const $ = require("jquery");
const fetchimgIdFromPage = require("./fetchimgIdFromPage");
var $item = $(".btn-item"),
  $links = $('link[rel="import"]'),
  $pageContainer = $("#page-wrap"),
  $close = $("#page-wrap-close"),
  html;

$close.on("click", function() {
  $pageContainer.hide();
});

$item.on("click", function() {
  var page = $(this).attr("data-page");
  console.log(page);
  html = $links.filter('[data-importpage="' + page + '"]')[0].import.querySelector(".page-template").innerHTML;
  $pageContainer
    .show()
    .find("#page-template-container")
    .html(html);
});

var $randomImg = $("#random-bg"),
  $fengche = $("#fengche"),
  isFetchingImg = false,
  errorCount = 0,
  bgImg; // 展示的背景图片

updateBackgroundImage(true);

$randomImg.on("click", function() {
  if (isFetchingImg) {
    return;
  }
  $fengche.addClass("xuanzhuan");
  updateBackgroundImage(false);
});

function updateBackgroundImage(ispreload) {
  debugger;
  if (isFetchingImg) {
    return;
  }
  isFetchingImg = true;
  fetchimgIdFromPage()
    .then(imgId => {
      if (imgId) {
        $(".preview-img").attr("src", getImgUrlFromId(imgId, "preview"));
        imgurl = getImgUrlFromId(imgId);
        $("#preview-img-w").addClass("canpreview");
        return loadImg(imgurl);
      } else {
        $("#preview-img-w").removeClass("canpreview");
        return Promise.reject();
      }
    })
    .then(
      originImageUrl => {
        if (!ispreload) {
          $("#container").css("background-image", `url(${bgImg})`);
          $fengche.removeClass("xuanzhuan");
          bgImg = originImageUrl;
        }
        bgImg = originImageUrl;
        isFetchingImg = false;
      },
      () => {
        errorCount++;
        if (errorCount < 5) {
          updateBackgroundImage();
        } else {
          $fengche.removeClass("xuanzhuan");
          isFetchingImg = false;
        }
      }
    );
}

function getImgUrlFromId(id, type) {
  if (type == "preview") {
    return "https://alpha.wallhaven.cc/wallpapers/thumb/small/th-" + id + ".jpg";
  } else {
    return "https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-" + id + ".jpg";
  }
}

function loadImg(url) {
  var image = new Image();
  return new Promise((re, rj) => {
    image.onload = () => {
      re();
    };
    image.onerror = () => {
      rj();
    };
    image.src = url;
  });
}
// $item.filter('[data-page="encode"]').trigger("click");
