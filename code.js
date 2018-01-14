//in seconds
var sessionTimeSec = 1500;
var shortTimeSec = 300;
var longTimeSec = 1200;
var currentTime= 1500;
//counter of times clock runned
var numRuns =0;
//counter for breaks
var numBreaks = 1;
//it is working or pending counter
var running = false;
//it is break or working session counter
var br = false;
//starting poin for timer
var timerHeight = 0;
//seting up canvas area
var canvas;
var context;

const canvasSize = 300;
const audio = new Audio("audio/beep.wav");


$(window).ready(function(){
    canvas = document.getElementById("timerCan");
    context = canvas.getContext("2d");

    $("button").click(function () {
        buttons($(this).attr("value"));
    });
    
    setInterval(function () {
        drawAll();
    }, 1);

    setInterval(function () {
        run();
    }, 1000);
})

function buttons(val) {
    switch (val) {
        case "sessionMinus":
            if (sessionTimeSec > 60) {
                sessionTimeSec -= 60;
                currentTime = sessionTimeSec;
            } else {
                alert("Session time can not be 0");
            }
            displaySettings("sessionLength", sessionTimeSec/60);
            break;
        case "sessionPlus":
            if (sessionTimeSec < 3600) {
                sessionTimeSec += 60;
                currentTime = sessionTimeSec;
            } else {
                alert("Do not push yourself so much. You have to take breaks!")
            }
            displaySettings("sessionLength", sessionTimeSec/60);
            break;
        case "shortMinus":
            if (shortTimeSec > 60) {
                shortTimeSec -= 60;
            } else {
                alert("Break time can not be 0");
            }
            displaySettings("shortBreak", shortTimeSec/60);
            break;
        case "shortPlus":
            if (shortTimeSec < longTimeSec-60) {
                shortTimeSec += 60;
            } else {
                alert("Short break has to be shorter than the long one!"); 
            }
            displaySettings("shortBreak", shortTimeSec/60);
            break;
        case "longMinus":
            if (longTimeSec > shortTimeSec+60) {
                longTimeSec -= 60;
            } else {
                alert("Long break has to be longer than the short one!");
            }
            displaySettings("longBreak", longTimeSec/60);
            break;
        case "longPlus":
            if (longTimeSec < 3600) {
                longTimeSec += 60;
            } else {
                alert("You have work to do! Do not spend your free time.");
            }
            displaySettings("longBreak", longTimeSec/60);
            break;
        case "start":
            running= !running;
            if (running) {
                currentTime = sessionTimeSec;
                heightPace = 150 / currentTime;
                $("#startButt").html("reset");
                sessionLength = sessionTimeSec;
                shortLength = shortTimeSec;
                longLength = longTimeSec;
                $("#state").css("visibility", "visible");
            } else {
                $("#startButt").html("start");
                reset();
            }
            break;
    }
    drawTimer();
}

function displaySettings(setting, val) {
    setting = "#"+ setting;
    $(setting).html(val);
}

function drawAll() {
    drawBackground();
    drawTimer();
    drawCounter();
}

function drawBackground() {
    context.fillStyle = "#FFF";
    context.fillRect(0, 0, canvasSize, canvasSize);
}

function drawTimer() {
    context.fillStyle = "#d91e25";
    context.fillRect(0, timerHeight, canvasSize, canvasSize);
}

function drawCounter() {
    context.font = "55px Sonsie One";
    context.textAlign = "center";
    context.fillStyle = "#bd8d2d";
    context.shadowColor = "#000";
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    if (currentTime % 60 < 10) {
        context.fillText("" + Math.trunc(currentTime / 60) + ":0" + (currentTime % 60) + "", canvasSize / 2, canvasSize / 3.3);
    }else {
        context.fillText("" + Math.trunc(currentTime / 60) + ":" + (currentTime % 60) + "", canvasSize / 2, canvasSize / 3.3);
    }   
}

function reset() {
    running= false;
    sessionTimeSec = 1500;
    currentTime= 1500;
    shortTimeSec = 300;
    longTimeSec = 1200;
    numRuns = 0;
    numBreaks = 1;
    br = false;
    timerHeight= 0;
    $("#state").css("visibility", "hidden");
    displaySettings("sessionLength", sessionTimeSec/60);
    displaySettings("shortBreak", shortTimeSec/60);
    displaySettings("longBreak", longTimeSec/60);
}

function run() {
    if (running && currentTime > 0) {
        currentTime--;
        if (!br) {
            timerHeight += heightPace;
        } else {
            timerHeight -= heightPace;
        }
    } else if (currentTime == 0) {
        audio.play();
        if (br) {
            timerHeight = 0;
            $("#state").html("Working time!");
        } else {
            timerHeight = 150;
            $("#state").html("Break time!");
        }
        br = !br;
        numRuns++;
        if (numRuns % 2 == 0) {
            currentTime = sessionTimeSec;
        } else {
            if (numBreaks < 4 || numBreaks % 4 != 0) {
                currentTime = shortTimeSec;
                numBreaks++;
            } else {
                currentTime = longTimeSec;
                numBreaks++;
            }
        }
        heightPace = 150 / currentTime; 
    }
}