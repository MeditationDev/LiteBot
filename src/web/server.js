const http = require('http');
const url = require('url');
const fs = require('fs');
var encode=require("./encode"),configs=require("../configs"),logger=require("../utils/logger");
var apis={},sites={}
var apiNames=[],siteNames=[];
var server;
function addAPI(name,js,needLogin){
    apis[name]={js:js,needLogin:needLogin};
    apiNames.push(name);
}
function addSite(name,file,type){
    sites[name]={file:file,type:type}
    siteNames.push(name);
}
function write404(res){
    res.writeHead(404, {
        'Content-Type': 'text/html;charset=UTF-8'
    });
    res.write("<html><head><title>404 Not Found</title></head><body><center><h1>404 Not Found</h1></center><hr><center>LiteBot</center></body></html>");
}
function writeRedirect(href,res){
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=UTF-8'
    });
    res.write("<html><head><title>Redirecting</title></head><body>Redirecting You To <a href=\""+href+"\">"+href+"</a><script>location.href=\""+href+"\"</script></body></html>");
}
function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
function getResource(res,file){
    if(fs.existsSync("./res/libs/"+file)&&fs.statSync("./res/libs/"+file).isFile()){
        var format=file.split(".");
        res.writeHead(200, {
            'Content-Type': 'text/'+format[format.length-1]+';charset=UTF-8',
            "Access-Control-Allow-Origin":"*"
        });
        res.write(fs.readFileSync("./res/libs/"+file))
    }else{
        write404(res);
    }
}
function checkLogin(req){
    var cookie=parseCookies(req)
    if(cookie.token===encode.token){
        return true;
    }
    return false;
}
function writeHTML(file,res){
    res.writeHead(200, {
        'Content-Type': 'text/html;charset=UTF-8'
    });
    res.write(file)
}
function parsePage(req,path,res){
    if(siteNames.includes(path)){
        var json=sites[path];
        switch (json.type){
            case "REDIRECT":{
                writeRedirect(json.file,res);
                break;
            }
            case "SITE":{
                writeHTML(json.file, res)
                break;
            }
        }
    }
}
function parseAPI(req,path,res,logined){
    var name=path.pathname.split("/")[2].toLowerCase();
    if(apiNames.includes(name)){
        if(apis[name].needLogin){
            if(!logined){
                return;
            }
        }
        apis[name].js(req,path,res)
    }else{
        res.write(JSON.stringify({code:"err",reason:"WRONG API PATH"}))
    }
}
function start(){
    addSite('/',"/dashboard","REDIRECT");
    addSite('/dashboard',fs.readFileSync("./res/htmls/dashboard.html"),"SITE");
    addSite('/settings',fs.readFileSync("./res/htmls/settings.html"),"SITE")
    addAPI('login',require("./api/login"),false);
    addAPI('stat',require("./api/stat"),true);
    sites["login"]={file:fs.readFileSync("./res/htmls/login.html")};
    server=http.createServer(function(req, res) {
        try {
            var logined=checkLogin(req);
            var path = url.parse(req.url, true);
            switch (path.pathname.split("/")[1]) {
                case "res": {
                    getResource(res, path.pathname.substring(5, path.pathname.length))
                    res.end();
                    return
                }
                case "api": {
                    parseAPI(req, path, res,logined)
                    res.end();
                    return;
                }
                default: {
                    if (logined) {
                        parsePage(req,path.pathname,res);
                        res.end();
                    } else {
                        if(path.pathname==="/") {
                            writeHTML(sites["login"].file, res)
                        }else{
                            writeRedirect("/",res)
                        }
                        res.end();
                    }
                }
            }
        }catch (e){
            logger.err(e);
        }
    })
    server.listen(configs.config.port);
}
module.exports={
    start:start,
    addAPI:addAPI,
    addSite:addSite
}