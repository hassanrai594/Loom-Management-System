var date4 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })

var time1 = "03:01";
var time2 = "01:19";

function strToMins(t) {
    var s = t.split(":");
    return Number(s[0]) * 60 + Number(s[1]);
}

function minsToStr(t) {
    return Math.trunc(t / 60) + ':' + ('00' + t % 60).slice(-2);
}

var result1 = strToMins(date4) - strToMins(time2);
const hours1 = Math.floor(result1 / 60);
console.log(hours1);

var date5 = new Date().toLocaleTimeString([], { hour: '2-digit', minute: "2-digit", hour12: false })

console.log(date5)