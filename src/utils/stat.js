var osu = require('os-utils');
var stat={
    cpu:0,
    nowmem:0,
    maxmem:0
}
function getStatsData(){
    osu.cpuUsage(function(v){
        stat.cpu=Number((v*100).toFixed(1));
        stat.maxmem=parseInt(osu.totalmem());
        stat.nowmem=parseInt(osu.freemem());
    });
}
function init(){
    getStatsData();
    setInterval(function (){
        getStatsData()
    },10000)
}
function getData(){
    return stat;
}

module.exports = {
    init:init,
    data:getData
}
