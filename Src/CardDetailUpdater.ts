let argMap = {};
let currentArg = "";
for(let i = 0; i < process.argv.length; i++){
    let piece = process.argv[i];
    if(piece.substr(0,1) === "-"){
        currentArg = piece.substring(1, piece.length);
    }else if(piece.length > 0 && currentArg.length > 0){
        argMap[currentArg] = argMap[currentArg] || [];
        argMap[currentArg].push(piece);
    }
}

if(!argMap["set"]){
    console.log("Missing set param");
}