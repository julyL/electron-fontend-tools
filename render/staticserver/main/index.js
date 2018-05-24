const createServer = require("./createServer");
const ipc = require('electron').ipcRenderer
require("./contextMenu");
const open = require("open");
const ip = require('ip');
const $ = require('jquery');
const qrcode = require('qrcode');
const PORT = 3456;
const holder = document.getElementById('holder');
var myip = ip.address(),
    openUrl = `http://${myip}:${PORT}/`,
    canPreview = false;

holder.ondragover = () => {
    return false;
};
holder.ondragleave = holder.ondragend = () => {
    return false;
};
holder.ondrop = (e) => {
    e.preventDefault();
    for (let f of e.dataTransfer.files) {
        console.log('File(s) you dragged here: ', f.path);
        canPreview = true;
        let stopOpen = false;
        createServer({
            port: PORT,
            filepath: f.path
        }).catch((err) => {
            stopOpen = true;
            alert(err);
        })
        setTimeout(async () => {
            if (!stopOpen) {
                open(openUrl);
                let code = await qrcode.toDataURL(openUrl);
                holder.children[0].innerHTML = `<img src="${code}" class="qrcode" />预览地址: <span class='link' title="点击跳转到预览地址">${openUrl}</span>`;
            }
        }, 100);
    }
    return false;
};

holder.onclick = (e) => {
    var classList = [].slice.call(e.target.classList);
    if (classList.indexOf('link') != -1) {
        open(openUrl);
    }
}

ipc.on("preview", function () {
    if (canPreview) {
        $(holder).toggle();
    } else {
        alert("请先拖入文件夹")
    }
    console.log('show webview');
})