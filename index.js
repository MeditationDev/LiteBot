var web={
    encode:require("./src/web/encode"),
    server:require("./src/web/server")
}
var logger=require("./src/utils/logger"),
    stat=require("./src/utils/stat"),
    configs=require("./src/configs");
logger.info("Starting LiteBot v20201206...")
stat.init();
web.encode.token=web.encode.randomStr(100);
web.server.start();
logger.info("Web Manage Panel started at localhost:"+configs.config.port)