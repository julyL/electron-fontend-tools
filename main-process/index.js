const $ = require("jquery");
const store = require("./store");
const fetchImgIdFromPage = require("./fetchImgIdFromPage");
var $item = $(".btn-item"),
  $links = $('link[rel="import"]'),
  $pageContainer = $("#page-wrap"),
  $close = $("#page-wrap-close"),
  $container = $("#container"),
  html;

var bgimg = store.get("backgroundImage");
if (bgimg) {
  $container.css("background-image", `url(${bgimg})`);
}

$item.on("animationend", () => {
  $item.removeClass("zoomIn animated");
});

// 关闭页面
$close.on("click", function() {
  $pageContainer.hide();
});

// 切换页面
$item.on("click", function() {
  var page = $(this).attr("data-page");
  console.log(page);
  html = $links.filter('[data-importpage="' + page + '"]')[0].import.querySelector(".page-template").innerHTML;
  $pageContainer.find("#page-template-container").html(html);
  setTimeout(() => {
    $pageContainer.show();
  }, 17);
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
  // debugger;
  if (isFetchingImg) {
    return;
  }
  isFetchingImg = true;
  fetchImgIdFromPage()
    .then(imgId => {
      if (imgId) {
        $(".preview-img").attr("src", getImgUrlFromId(imgId, "preview"));
        imgurl = getImgUrlFromId(imgId);
        $("#preview-img-w")
          .addClass("canpreview")
          .fadeIn();
        return loadImg(imgurl);
      } else {
        $("#preview-img-w").removeClass("canpreview");
        return Promise.reject();
      }
    })
    .then(
      originImageUrl => {
        if (!ispreload) {
          if (bgImg) {
            store.set("backgroundImage", bgImg);
            $container.css("background-image", `url(${bgImg})`);
          }
          $fengche.removeClass("xuanzhuan");
          bgImg = originImageUrl;
        }
        bgImg = originImageUrl;
        isFetchingImg = false;
        errorCount = 0;
      },
      () => {
        // 图片加载失败，则重复尝试5次
        errorCount++;
        isFetchingImg = false;
        if (errorCount < 5) {
          updateBackgroundImage();
        } else {
          $fengche.removeClass("xuanzhuan");
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
      re(url);
    };
    image.onerror = () => {
      rj();
    };
    image.src = url;
  });
}
// $item.filter('[data-page="minifyimg"]').trigger("click");
