const $ = require("jquery"),
  store = require("./store"),
  fetchImgIdFromPage = require("./fetchImgIdFromPage");

var $item = $(".btn-item"),
  $links = $('link[rel="import"]'),
  $pageContainer = $("#page-wrap"),
  $close = $("#page-wrap-close"),
  $container = $("#container"),
  $content = $("#content"),
  html;
  
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());
  
var bgimg = store.get("backgroundImage");
if (bgimg) {
  $container.css("background-image", `url(${bgimg})`);
}

// 动画结束后移除animate类
$item.on("animationend", () => {
  $item.removeClass("zoomIn animated");
});

// 关闭页面
$close.on("click", function() {
  $pageContainer.fadeOut(250);
});

// 切换页面
$item.on("click", function() {
  var page = $(this).attr("data-page");
  console.log(page);
  html = $links.filter('[data-importpage="' + page + '"]')[0].import.querySelector(".page-template").innerHTML;
  $pageContainer.find("#page-template-container").html(html);
  setTimeout(() => {
    $pageContainer.fadeIn(250);
  }, 17);
});

var $randomImg = $("#random-bg"),
  $fengche = $("#fengche"),
  isFetchingImg = false,
  errorCount = 0,
  bgImg; // 展示的背景图片

updateBackgroundImage(true);

$randomImg.on("click", function() {
  $fengche.addClass("xuanzhuan");
  if (isFetchingImg) {
    return;
  }
  updateBackgroundImage(false);
});

/**
 * 更新背景图片
 * @param {Boolean} ispreload 是否是预加载(预加载情况下只下载图片,并不更新背景图)
 * @returns
 */
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

/**
 * 根据图片id获取相应的图片
 *
 * @param {String} id 图片的id
 * @param {String} type 图片的类型(preview:预览图, 默认:原图)
 * @returns
 */
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
