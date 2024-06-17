// 音乐切换标识(全局可访问变量)
var music = false;
// 获取按钮点击音效
var clickSound = new Audio('audio/click.mp3');
// 获取菜单背景声音
var menuSound = new Audio('audio/卡农.mp3');
// 获取游戏背景声音
var gameSound = new Audio('audio/雪人兄弟.mp3');
// 设置音乐
menuSound.loop = true;
gameSound.loop = true;

window.onload = function () {
    // 获取游戏菜单
    var menu = this.document.querySelector(".menuWrap");
    // 获取游戏区域
    var gameWrap = this.document.querySelector(".wrapper");
    // 获取开始游戏按钮
    var play = this.document.querySelector(".playGame");
    // 获取游戏设置按钮
    var set = this.document.querySelector(".setGame");
    // 获取游戏指南说明
    var guide = this.document.querySelector(".gameGuide");
    // 获取弹窗背景
    var popWrap = this.document.querySelector(".popWrapper");
    // 获取游戏设置弹窗
    var setPop = this.document.querySelector(".setPop");
    var setClose = this.document.querySelector(".setBtn");
    // 获取游戏说明弹窗
    var guidePop = this.document.querySelector(".guidePop");
    var guideClose = this.document.querySelector(".guideBtn");
    // 获取声音图标
    var soundIcon = this.document.querySelector(".iconfont");
    // 获取关闭音乐按钮
    var closeSound = this.document.querySelector(".closeBtn");
    // 获取打开音乐按钮
    var openSound = this.document.querySelector(".openBtn");

    //弹窗背景样式
    popWrap.style.width = this.document.documentElement.clientWidth + "px";
    popWrap.style.height = 800 + "px";
    // 声音图标样式
    soundIcon.style.color = "red";
    // 声音图标控制音乐
    soundIcon.addEventListener('click', function () {
        if (music) {
            soundIcon.innerHTML = "&#xe605;";
            soundIcon.style.color = "red";
            menuSound.pause();
            gameSound.pause();
            music = false;
        } else {
            soundIcon.innerHTML = "&#xe607;";
            soundIcon.style.color = "";
            menuSound.play();
            music = true;
        }
    });

    // 进入游戏界面
    play.addEventListener("click", function () {
        // 触发音效
        clickSound.play();
        window.free.toggleClass(menu, "displays");
        window.free.toggleClass(gameWrap, "displays");
        // 关闭菜单背景音乐
        menuSound.pause();
        if (music) {
            gameSound.play();
        } else {
            gameSound.pause();
        }
    });

    // 游戏设置功能
    set.addEventListener("click", function () {
        // 触发音效
        clickSound.play();
        window.free.toggleClass(popWrap, "displays");
        window.free.toggleClass(setPop, "displays");
    });

    // 关闭所有背景音乐
    closeSound.addEventListener("click", function () {
        soundIcon.innerHTML = "&#xe605;";
        soundIcon.style.color = "red";
        menuSound.pause();
        music = false;
    });
    // 开启所有音乐
    openSound.addEventListener("click", function () {
        soundIcon.innerHTML = "&#xe607;";
        soundIcon.style.color = "";
        menuSound.play();
        music = true;
    });

    // 设置声音弹窗关闭按钮
    setClose.addEventListener("click", function () {
        window.free.toggleClass(popWrap, "displays");
        window.free.toggleClass(setPop, "displays");
    });

    // 设置游戏说明弹窗
    guide.addEventListener("click", function () {
        // 触发音效
        clickSound.play();
        window.free.toggleClass(popWrap, "displays");
        window.free.toggleClass(guidePop, "displays");
    });
    // 设置游戏说明关闭按钮
    guideClose.addEventListener("click", function () {
        window.free.toggleClass(popWrap, "displays");
        window.free.toggleClass(guidePop, "displays");
    });
};