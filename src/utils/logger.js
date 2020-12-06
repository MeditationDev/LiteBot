const moment=require("moment")
function getTime(){
    return moment(new Date().getTime()).format('HH:mm:ss');
}
function log(type,message){
    console.log(getTime()+" ["+type+"] "+message);
}
function info(message){
    log("INFO",message)
}
function warn(message){
    log("WARN",message)
}
function err(message){
    log("ERROR",message)
}
function debug(message){
    if(this.isDebug) {
        log("DEBUG", message)
    }
}

module.exports = {
    log:log,
    info:info,
    warn:warn,
    err:err,
    debug:debug,
    isDebug:false
}
