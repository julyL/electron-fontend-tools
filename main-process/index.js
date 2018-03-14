const $ = require("jquery");
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
  // debugger;
  html = $links.filter('[data-importpage="' + page + '"]')[0].import.querySelector(".page-template").innerHTML;
  $pageContainer
    .show()
    .find("#page-template-container")
    .html(html);
});
