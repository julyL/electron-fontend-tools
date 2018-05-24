const remote = require('electron').remote;
const ipc = require('electron').ipcRenderer;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;
const Notify = require('./notify');
var menu = new Menu();
var openDevTools = false;

// var MenuTemplate = [{
//     label: '开发者工具',
//     checked: false,
//     click: function (item) {
//         if (openDevTools) {
//             ipc.send('openDevTools');
//         } else {
//             ipc.send('closeDevTools');
//         }
//         openDevTools = !openDevTools;
//         console.log(item);
//         item.checked = true;
//     }
// }, {
//     type: 'separator'
// }, {
//     label: '预览',
//     checked: false,
//     click: function () {
//         ipc.send('preview');
//         console.log('item 2 clicked');
//     }
// }, {
//     type: 'separator'
// }, {
//     label: '下载通知',
//     checked: false,
//     click: function () {
//         Notify.can = !Notify.can;
//     }
// }]
// var menu = Menu.buildFromTemplate(MenuTemplate);
// Menu.setApplicationMenu(menu);

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);