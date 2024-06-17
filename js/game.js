window.addEventListener("load", function () {
    // 获取画布
    var chess = document.querySelector(".chess");
    // 获取悔棋按钮
    var retract = document.querySelector(".retractBtn");
    // 获取撤销悔棋按钮
    var unretract = document.querySelector(".unretractBtn");
    // 获取重新开始按钮
    var restart = document.querySelector(".restartBtn");
    // 获取返回主菜单按钮
    var mainMenu = document.querySelector(".menuBtn");
    // 获取游戏区域
    var gameWrap = document.querySelector(".wrapper");
    // 获取游戏菜单
    var menu = document.querySelector(".menuWrap");
    // 获取玩家游戏信息
    var playerStep = document.querySelector(".playerStep > span");
    var playerScore = document.querySelector(".playerScore > span");
    var playerWin = document.querySelector(".playerWin > span");
    // 获取电脑游戏信息
    var computerStep = document.querySelector(".computerStep > span");
    var computerScore = document.querySelector(".computerScore > span");
    var computerWin = document.querySelector(".computerWin > span");

    // 获取棋子落下声音
    var downMp3 = new Audio("audio/chessDown.mp3");
    // 获取游戏胜利音效
    var winMp3 = new Audio("audio/win.mp3");
    // 获取游戏失败音效
    var failMp3 = new Audio("audio/fail.mp3");


    //棋盘宽高
    var chessWidth = 15;
    // 鼠标点击坐标
    var eventX, eventY;
    // 电脑落子目标坐标（得分最大位置）
    var goalX = -1,
        goalY = -1;
    //游戏是否结束(默认游戏没有结束)
    var gameOver = false;
    // 是否悔棋(初始无法悔棋)
    var isRetract = false;
    // 是否撤销悔棋(初始无法撤销悔棋)
    var isUnretract = false;
    // 是否重新开始
    var isRestart = false;
    // 是否是玩家下棋（默认玩家先下）
    var isMan = true;
    // 保存棋盘位置的分数
    var score = [];
    for (var i = 0; i < chessWidth; i++) {
        score[i] = [];
    }
    //已经落子的集合
    var chessPlace = [];
    for (var i = 0; i < chessWidth; i++) {
        chessPlace[i] = [];
    }
    // 初始化没有落子标记为 0 
    for (var i = 0; i < chessWidth; i++) {
        for (var j = 0; j < chessWidth; j++) {
            chessPlace[i][j] = 0;
            console.log(chessPlace[i][j]);
        }
    }

    // 获取画笔
    if (chess.getContext) {
        var ctx = chess.getContext("2d");
    }
    // 绘制棋盘
    function chessBoard() {
        for (var i = 0; i < chessWidth; i++) {
            // 绘制棋盘横向线段
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(20, 20 + i * 40);
            ctx.lineTo(580, 20 + i * 40);
            ctx.stroke();
            // ctx.restore();
            // 绘制棋盘纵向线段
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(20 + i * 40, 20);
            ctx.lineTo(20 + i * 40, 580);
            ctx.stroke();
            ctx.restore();
        }
    }
    // 绘制棋子
    function drawChess(eventX, eventY, flag) {
        ctx.fillStyle = flag ? "#000" : "#fff";
        ctx.beginPath();
        ctx.arc(20 + eventX * 40, 20 + eventY * 40, 10, 0, 360 * Math.PI / 180, true);
        ctx.fill();
        // 将棋子聚焦到线条的交点上（方式二，性能较低）
        // var wrap = document.querySelector(".wrapper");
        // eventX = event.clientX - wrap.offsetLeft;
        // eventY = event.clientY - wrap.offsetTop;
        // for (var i = 0; i < chessWidth; i++) {
        //     for (var j = 0; j < chessWidth; j++) {
        //         if (eventX >= (20 + j * 40 - 20) && eventX <= (20 + j * 40 + 20) && eventY >= (20 + i * 40 - 20) && eventY <= (20 + i * 40 + 20)) {
        //             eventX =0 * j + 20;
        //             eventY = 40 * i + 20;
        //             break;
        //         }
        //     }
        // }
        // ctx.beginPath();
        // ctx.arc(eventX, eventY, 10, 0, 360 * Math.PI, true);
        // ctx.fill();
    }
    // 清空棋盘
    function clear() {
        // 清空棋盘
        ctx.clearRect(0, 0, chess.width, chess.height);
        // 重新绘制棋盘
        chessBoard();
        for (var i = 0; i < chessWidth; i++) {
            for (var j = 0; j < chessWidth; j++) {
                // 重置棋盘各个位置信息为0（标识此时棋盘没有落子）
                chessPlace[i][j] = 0;
            }
        }
    }
    // 清空棋子
    function clearChess(x, y) {
        // 清除该位置棋子
        ctx.clearRect(x * 40, y * 40, 40, 40);
        // 清除棋子的位置标记为零
        chessPlace[x][y] = 0;
        // 绘制被清除的棋盘线条
        x = x * 40 + 20;
        y = y * 40 + 20;
        // 绘制水平线
        ctx.beginPath();
        ctx.moveTo(x - 20, y);
        ctx.lineTo(x + 20, y);
        ctx.stroke();
        // 绘制垂直线
        ctx.beginPath();
        ctx.moveTo(x, y - 20);
        ctx.lineTo(x, y + 20);
        ctx.stroke();
    }
    //判断输赢
    function win(eventX, eventY, num) {
        // 保存相同棋子连在一起的个数
        var sum = 0;
        // 保存当前棋子坐标
        var x = eventX;
        var y = eventY;
        // 横向获胜
        for (var i = x - 1; i >= 0; i--) {
            if (chessPlace[i][y] == num) {
                sum++;
            } else {
                break;
            }
        }
        for (var i = x + 1; i < chessWidth; i++) {
            if (chessPlace[i][y] == num) {
                sum++;
            } else {
                break;
            }
        }
        if (sum >= 4) {
            return true;
        }
        sum = 0;
        // 纵向获胜
        for (var i = y - 1; i >= 0; i--) {
            if (chessPlace[x][i] == num) {
                sum++;
            } else {
                break;
            }
        }
        for (var i = y + 1; i < chessWidth; i++) {
            if (chessPlace[x][i] == num) {
                sum++;
            } else {
                break;
            }
        }
        if (sum >= 4) {
            return true;
        }
        sum = 0;
        // 正斜线获胜
        for (var i = x - 1, j = y - 1; i >= 0 && j >= 0; i--, j--) {
            if (chessPlace[i][j] == num) {
                sum++;
            } else {
                break;
            }
        }
        for (var i = x + 1, j = y + 1; i < chessWidth && j < chessWidth; i++, j++) {
            if (chessPlace[i][j] == num) {
                sum++;
            } else {
                break;
            }
        }
        if (sum >= 4) {
            return true;
        }
        sum = 0;
        // 反斜线获胜
        for (var i = x - 1, j = y + 1; i >= 0 && j < chessWidth; i--, j++) {
            if (chessPlace[i][j] == num) {
                sum++;
            } else {
                break;
            }
        }
        for (var i = x + 1, j = y - 1; i < chessWidth && j >= 0; i++, j--) {
            if (chessPlace[i][j] == num) {
                sum++;
            } else {
                break;
            }
        }
        if (sum >= 4) {
            return true;
        }
        sum = 0;
    }
    // 判断是否平局
    function tie() {
        var count = 0;
        for (var i = 0; i < chessWidth; i++) {
            for (var j = 0; j < chessWidth; j++) {
                if (chessPlace[i][j] != 0) {
                    count++;
                } else {
                    break;
                }
            }
        }
        if (count == 225) {
            return true;
        }
    }
    // 悔棋
    retract.addEventListener("click", function () {
        // 触发按钮点击音效
        clickSound.play();
        if (gameOver) {
            alert("游戏已经结束，无法悔棋！");
        } else if (isRetract == false) {
            alert("无法悔棋！");
        } else {
            isRetract = false; //表示已经悔过棋子了,不能再悔棋
            isUnretract = true; //悔过棋子后才可以撤销悔棋
            clearChess(eventX, eventY); //清除目标位置玩家棋子
            clearChess(goalX, goalY); //清除目标位置电脑棋子
            playerData("", "retract"); //重置玩家游戏数据
            computerData("", "retract"); //重置电脑游戏数据
        }
    });
    // 撤销悔棋
    unretract.addEventListener("click", function () {
        // 触发按钮点击音效
        clickSound.play();
        if (gameOver) {
            alert("游戏已经结束，无法撤销悔棋！");
        } else if (isUnretract == false) {
            alert("无法撤销！");
        } else {
            isUnretract = false; //撤销后不能再次撤销
            isRetract = true; //撤销悔棋后，可以再次悔棋（当前落子位置）
            drawChess(eventX, eventY, true); //绘制目标位置玩家棋子
            drawChess(goalX, goalY, false); //绘制目标位置电脑棋子
            chessPlace[eventX][eventY] = 1;
            chessPlace[goalX][goalY] = 2;
            playerData(); //重置玩家游戏数据
            computerData(); //重置电脑游戏数据
        }
    });
    // 重新开始
    restart.addEventListener("click", function () {
        // 触发按钮点击音效
        clickSound.play();
        if (isRestart) {
            isRestart = false;
            var choice = confirm("重新开始将会清空当前游戏进度，确定要重新开始吗？");
            if (choice) {
                clear(); //清空棋盘
                gameOver = false;
                isMan = true; //玩家下棋
                isRetract = false; //无法悔棋
                isUnretract = false; //无法撤销悔棋
                // 清空游戏数据
                playerData("", "clearAll");
                computerData("", "clearAll");
            }
        } else {
            confirm("尚未开始对局！");
        }
    });
    // 返回主菜单
    mainMenu.addEventListener("click", function () {
        // 触发按钮点击音效
        clickSound.play();
        gameOver = false;
        isMan = true; //玩家下棋
        isRetract = false; //无法悔棋
        isUnretract = false; //无法撤销悔棋
        var choice = confirm("返回主菜单将清空所有游戏数据，是否继续？");
        if (choice) {
            window.free.toggleClass(menu, "displays");
            window.free.toggleClass(gameWrap, "displays");
            // 清空游戏数据
            playerData("", "clearAll");
            computerData("", "clearAll");
            // 清空棋盘
            clear();
            // 关闭游戏背景音乐
            gameSound.pause();
            if (music) {
                menuSound.play();
            } else {
                menuSound.pause();
            }
        }
    });

    // 玩家游戏数据处理
    var playerCount = 0;
    var playerWinCount = 0;

    function playerData(win, flag) {
        // 重置所有数据
        if (flag == "clearAll") {
            playerCount = -1;
            playerWinCount = 0;
            playerWin.innerHTML = playerWinCount + "次";
        }
        // 重置步数和分数
        if (flag == "clearPath") {
            playerCount = -1;
        }
        // 如果悔棋，步数和分数减少
        if (flag == "retract") {
            playerCount -= 2;
        }
        playerCount++;
        playerStep.innerHTML = (playerCount) + "步";
        playerScore.innerHTML = (playerCount * 10) + "分";
        if (win) {
            playerWinCount++;
            playerWin.innerHTML = playerWinCount + "次";
        }
    }
    // 电脑游戏数据处理
    var computerCount = 0;
    var computerWinCount = 0;

    function computerData(win, flag) {
        // 重置所有数据
        if (flag == "clearAll") {
            computerCount = -1;
            computerWinCount = 0;
            computerWin.innerHTML = computerWinCount + "次";
        }
        // 重置步数和分数
        if (flag == "clearPath") {
            computerCount = -1;
        }
        // 如果悔棋，步数和分数减少
        if (flag == "retract") {
            computerCount -= 2;
        }
        computerCount++;
        computerStep.innerHTML = (computerCount) + "步";
        computerScore.innerHTML = (computerCount * 10) + "分";
        // 如果获胜
        if (win) {
            computerWinCount++;
            computerWin.innerHTML = computerWinCount + "次";
        }
    }

    // 玩家下棋
    chess.addEventListener("click", function (event) {
        event = event || window.event;
        // 如果没有轮到玩家落子
        if (isMan == false) {
            alert("不要急，还没有轮到你哦。");
            return
        }
        // 如果游戏已经结束
        if (gameOver == true) {
            alert("游戏已经结束，请点击重新开始。");
            return
        }
        // 使棋子落在棋盘线条焦点上
        eventX = Math.floor(event.offsetX / 40);
        eventY = Math.floor(event.offsetY / 40);
        console.log(eventX);
        // 如果当前位置没有落子才能落子
        if (chessPlace[eventX][eventY] == 0) {
            // 落子
            drawChess(eventX, eventY, true);
            // 记录数据
            playerData();
            // 落子音效
            downMp3.play();
            // 可以悔棋
            isRetract = true;
            // 不可以撤销悔棋
            isUnretract = false;
            // 可以重新开始
            isRestart = true;
            // 保存该落子的位置
            chessPlace[eventX][eventY] = 1;
            // 判断输赢
            if (win(eventX, eventY, num = 1)) {
                // 游戏结束
                gameOver = true;
                // 记录数据
                playerData(true);
                // 播放获胜音乐
                winMp3.play();
                // 电脑不能再落子
                isMan = true;
                // 提示是否再来一盘
                var choice = confirm("你赢了，再来一局？");
                if (choice) {
                    // 清空棋盘
                    clear();
                    // 清空落子步数和分数
                    playerData("", "clearPath");
                    computerData("", "clearPath");
                    gameOver = false;
                }
            }
            // 判断是否平局
            else if (tie()) {
                // 游戏结束
                gameOver = true;
                // 下一局轮到玩家下棋
                isMan = true;
                // 是否再来一局
                var choice = confirm("占成平局，再来一局？");
                if (choice) {
                    // 清空棋盘
                    clear();
                    // 清空落子步数和分数
                    playerData("", "clearPath");
                    computerData("", "clearPath");
                    gameOver = false;
                }
            } else {
                // 轮到电脑落子
                isMan = false;
            }
        } else {
            alert("当前位置已被占据，请选择其他位置落子");
        }
        if (gameOver == false && isMan == false) {
            // 电脑下棋
            computerDown();
        }
    });

    /**
     * 电脑下棋算法
     */
    // 五元组评分表
    function chessScore(playerNum, computerNum) {
        // 机器进攻

        // 1.既有人类落子，又有机器落子，判分为0
        if (playerNum > 0 && computerNum > 0) {
            return 0;
        }
        // 2.全部为空没有棋子，判分为7
        if (playerNum == 0 && computerNum == 0) {
            return 7;
        }
        // 3.机器落一子，判分为35
        if (computerNum == 1) {
            return 35;
        }
        // 4.机器落两子，判分为800
        if (computerNum == 2) {
            return 800;
        }
        // 5.机器落三子，判分为15000
        if (computerNum == 3) {
            return 15000;
        }
        // 6.机器落四子，判分为800000
        if (computerNum == 4) {
            return 800000;
        }

        // 机器防守

        // 7.玩家落一子，判分为15
        if (playerNum == 1) {
            return 15;
        }
        // 8.玩家落两子，判分为400
        if (playerNum == 2) {
            return 400;
        }
        // 9.玩家落三子，判分为1800
        if (playerNum == 3) {
            return 1800;
        }
        // 10.玩家落四子，判分为100000
        if (playerNum == 4) {
            return 100000;
        }

        return -1; //如果是其他情况，则出现错误，不会执行该段代码
    }
    // 电脑下棋
    function computerDown() {
        // 初始化score评分组
        for (var i = 0; i < chessWidth; i++) {
            for (var j = 0; j < chessWidth; j++) {
                score[i][j] = 0;
            }
        }
        // 五元组中黑棋(玩家)数量
        var playerNum = 0;
        // 五元组中白棋(电脑)数量
        var computerNum = 0;
        // 五元组临时得分
        var tempScore = 0;
        // 最大得分
        var maxScore = -1;

        // 横向寻找
        for (var i = 0; i < chessWidth; i++) {
            for (var j = 0; j < chessWidth - 4; j++) {
                for (var k = j; k < j + 5; k++) {
                    // 如果是玩家落得子
                    if (chessPlace[k][i] == 1) {
                        playerNum++;
                    } else if (chessPlace[k][i] == 2) { //如果是电脑落子
                        computerNum++;
                    }
                }
                // 将每一个五元组中的黑棋和白棋个数传入评分表中
                tempScore = chessScore(playerNum, computerNum);
                // 为该五元组的每个位置添加分数
                for (var k = j; k < j + 5; k++) {
                    score[k][i] += tempScore;
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }

        // 纵向寻找
        for (var i = 0; i < chessWidth; i++) {
            for (var j = 0; j < chessWidth - 4; j++) {
                for (var k = 0; k < j + 5; k++) {
                    // 如果是玩家落得子
                    if (chessPlace[i][k] == 1) {
                        playerNum++;
                    } else if (chessPlace[i][k] == 2) { //如果是电脑落子
                        computerNum++;
                    }
                }
                // 将每一个五元组中的黑棋和白棋个数传入评分表中
                tempScore = chessScore(playerNum, computerNum);
                // 为该五元组的每个位置添加分数
                for (var k = j; k < j + 5; k++) {
                    score[i][k] += tempScore;
                }
                // 清空五元组中棋子数量和瞬时分数值
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }


        // 反斜线寻找

        // 反斜线上侧部分
        for (var i = chessWidth - 1; i >= 4; i--) {
            for (var k = i, j = 0; j < chessWidth && k >= 0; j++, k--) {
                var m = k; //x 14 13
                var n = j; //y 0  1
                for (; m > k - 5 && k - 5 >= -1; m--, n++) {
                    // 如果是玩家落得子
                    if (chessPlace[m][n] == 1) {
                        playerNum++;
                    } else if (chessPlace[m][n] == 2) { //如果是电脑落子
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (m == k - 5) {
                    // 将每一个五元组中的黑棋和白棋个数传入评分表中
                    tempScore = chessScore(playerNum, computerNum);
                    // 为该五元组的每个位置添加分数
                    for (m = k, n = j; m > k - 5; m--, n++) {
                        score[m][n] += tempScore;
                    }
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }
        // 反斜线下侧部分
        for (var i = 1; i < 15; i++) {
            for (var k = i, j = chessWidth - 1; j >= 0 && k < 15; j--, k++) {
                var m = k; //y 1 
                var n = j; //x 14
                for (; m < k + 5 && k + 5 <= 15; m++, n--) {
                    // 如果是玩家落得子
                    if (chessPlace[n][m] == 1) {
                        playerNum++;
                    } else if (chessPlace[n][m] == 2) { //如果是电脑落子
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (m == k + 5) {
                    // 将每一个五元组中的黑棋和白棋个数传入评分表 中
                    tempScore = chessScore(playerNum, computerNum);
                    // 为该五元组的每个位置添加分数
                    for (m = k, n = j; m < k + 5; m++, n--) {
                        score[n][m] += tempScore;
                    }
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }

        // 正斜线寻找

        // 正斜线上侧部分
        for (var i = 0; i < chessWidth - 1; i++) {
            for (var k = i, j = 0; j < chessWidth && k < chessWidth; j++, k++) {
                var m = k;
                var n = j;
                for (; m < k + 5 && k + 5 <= chessWidth; m++, n++) {
                    // 如果是玩家落得子
                    if (chessPlace[m][n] == 1) {
                        playerNum++;
                    } else if (chessPlace[m][n] == 2) { //如果是电脑落子
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (m == k + 5) {
                    // 将每一个五元组中的黑棋和白棋个数传入评分表中
                    tempScore = chessScore(playerNum, computerNum);
                    // 为该五元组的每个位置添加分数
                    for (m = k, n = j; m < k + 5; m++, n++) {
                        score[m][n] += tempScore;
                    }
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }

        // 正斜线下侧部分
        for (var i = 1; i < chessWidth - 4; i++) {
            for (var k = i, j = 0; j < chessWidth && k < chessWidth; j++, k++) {
                var m = k;
                var n = j;
                for (; m < k + 5 && k + 5 <= chessWidth; m++, n++) {
                    // 如果是玩家落得子
                    if (chessPlace[n][m] == 1) {
                        playerNum++;
                    } else if (chessPlace[n][m] == 2) { //如果是电脑落子
                        computerNum++;
                    }
                }
                // 注意在斜向判断时，可能出现构不成五元组（靠近棋盘的四个顶角）的情况，所以要忽略这种情况
                if (m == k + 5) {
                    // 将每一个五元组中的黑棋和白棋个数传入评分表中
                    tempScore = chessScore(playerNum, computerNum);
                    // 为该五元组的每个位置添加分数
                    for (m = k, n = j; m < k + 5; m++, n++) {
                        score[n][m] += tempScore;
                    }
                }
                // 清空五元组中棋子数量和五元组临时得分
                playerNum = 0;
                computerNum = 0;
                tempScore = 0;
            }
        }

        // 从空位置中找到得分最大的位置
        for (var i = 0; i < chessWidth; i++) {
            for (var j = 0; j < chessWidth; j++) {
                if (chessPlace[i][j] == 0 && score[i][j] > maxScore) {
                    goalX = i;
                    goalY = j;
                    maxScore = score[i][j];
                }
            }
        }
        if (goalX != -1 && goalY != -1 && chessPlace[goalX][goalY] == 0) {
            // 落子
            drawChess(goalX, goalY, false);
            // 保存游戏数据
            computerData();
            // 保存该位置的落子
            chessPlace[goalX][goalY] = 2;
            // 判断输赢
            if (win(goalX, goalY, num = 2)) {
                // 游戏结束
                gameOver = true;
                // 保存游戏数据
                computerData(true);
                // 下一轮玩家落子
                isMan = true;
                var choice = confirm("你输了，再来一局？");
                // 播放失败音效
                failMp3.play();
                if (choice) {
                    // 清空棋盘
                    clear();
                    // 清空落子步数和分数
                    playerData("", "clearPath");
                    computerData("", "clearPath");
                    gameOver = false;
                }
            } else if (tie()) {
                // 游戏结束
                gameOver = true;
                // 下一局轮到玩家下棋
                isMan = true;
                // 是否再来一局
                var choice = confirm("占成平局，再来一局？");
                if (choice) {
                    // 清空棋盘
                    clear();
                    // 清空落子步数和分数
                    playerData("", "clearPath");
                    computerData("", "clearPath");
                    gameOver = false;
                }
            } else {
                // 轮到玩家下棋
                isMan = true;
            }
        }

    }
    // 初始化棋盘
    (function () {
        chessBoard();
    })();
});