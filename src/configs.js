const fs = require('fs');
module.exports = {
    config:JSON.parse(fs.readFileSync("./configs/config.json").toString())
}