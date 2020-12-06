var encode=require("../encode"),configs=require("../../configs");
function progress(req,path,res){
    if(path.query.name===configs.config.username&&path.query.pass===configs.config.password){
        res.write(JSON.stringify({code:"success",token:encode.token}))
    }else{
        res.write(JSON.stringify({code:"err",reason:"Wrong Account"}))
    }
}
module.exports = progress;