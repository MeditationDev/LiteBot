//rc4 encode/decode by Francesco Orsi
function rc4(str, key) {
    let s = [], j = 0, x, res = '';
    for (let i = 0; i < 256; i++) {
        s[i] = i;
    }
    for (let i = 0; i < 256; i++) {
        j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
    }
    let i = 0;
    j = 0;
    for (let y = 0; y < str.length; y++) {
        i = (i + 1) % 256;
        j = (j + s[i]) % 256;
        x = s[i];
        s[i] = s[j];
        s[j] = x;
        res += String.fromCharCode(str.charCodeAt(y) ^ s[(s[i] + s[j]) % 256]);
    }
    return res;
}
function randomNum(minNum,maxNum){
    switch(arguments.length){
        case 1:
            return parseInt(Math.random()*minNum+1,10);
            break;
        case 2:
            return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
            break;
        default:
            return 0;
            break;
    }
}
function randomChar(){
    switch (randomNum(0,2)){
        case 0:{
            return String.fromCharCode(randomNum(48,57));
        }
        case 1:{
            return String.fromCharCode(randomNum(65,90));
        }
        case 2:{
            return String.fromCharCode(randomNum(97,122));
        }
    }
}
function randomStr(len){
    var str="";
    for(var i=0;i<len;i++){
        str+=randomChar();
    }
    return str;
}
module.exports={
    randomStr:randomStr
}