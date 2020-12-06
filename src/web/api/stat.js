var stat=require("../../utils/stat");
function progress(req,path,res){
    var json=stat.data();
    json.code="success";
    res.write(JSON.stringify(json))
}
module.exports = progress;