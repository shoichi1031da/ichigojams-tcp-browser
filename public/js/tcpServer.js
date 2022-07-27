const express = require("express");
const app = express();
const { appendFile } = require("fs");
const net = require("net");
const serverPort = 1515; 

const host = "118.27.103.220";

let ichigojam = [];
let ichigojamIPaddress = [];
let ichigojamMnagement = [];
let ichigojamNo = 0;
let appjs = [];

const ichigojamErrors = [ 
    "Syntax%20error%0A", "Line%20error%0A", "Illegal%20argument%0A",
    "Divide%20by%20zero%0A", "Index%20out%20of%20range%0A", "File%20error%0A",
    "Not%20match%0A", "Stack%20over%0A", "Complex%20expression%0A",
    "Out%20of%20memory%0A", "Too%20long%0A", "Break%0A", "OK%0A"
]

const errorCheck = (msg) => {
    let errorMsg = false;
    let msgUri = encodeURI(msg);
    for(let i in ichigojamErrors){
        if(msgUri == ichigojamErrors[i]) errorMsg = true;
    }
    return errorMsg;
}

exports.relayServer = (serverPort) => {

    const tcpServer = net.createServer((socket) => {
        
        let IPaddress = socket.remoteAddress;
        if(IPaddress == "::1" || IPaddress.substr(7) == host) {
            cliantType = "ブラウザ";
            appjs.push(socket);
            console.log(cliantType + " / " + IPaddress + ": 接続しました\n");
        }else {
            cliantType = "IchigoJam";
            ichigojamIPaddress[ichigojam.length] = IPaddress.substr(7);
            ichigojam.push(socket);
            ichigojamMnagement.push({IPaddress:ichigojamIPaddress[ichigojam.length - 1]})
                // console.log(ichigojamMnagement);
                // console.log(JSON.stringify(ichigojamMnagement));
            appjs[0].write(JSON.stringify(ichigojamMnagement));
                console.log("- " + cliantType + "[" + (ichigojam.length - 1) + "]" + " / " + ichigojamIPaddress[ichigojam.length - 1] + ": 接続しました\n");
        }    

        
        socket.on("data" , (data) => {
            let msg = data.toString();

            if(msg.substr(0,1) == "%"){
                cliantType = "ブラウザ";
                IPaddress = msg.split("%")[1]; //ブラウザ側で指定したIPアドレス
                msg = msg.split("%")[2]; //ブラウザ側で指定したコマンド（メッセージ）
            }else {
                cliantType = "IchigoJam";
            }

        for(let i in ichigojam){

            //ブラウザからmsgが届いたとき
            if(cliantType == "ブラウザ"){
                if(ichigojam[i]  && IPaddress == ichigojamIPaddress[i]){ //IchigoJamの接続があり、IPアドレスの認証が正しいとき
                    
                    ichigojam[i].write(msg);
                    console.log(cliantType + " => IchigoJam[" + [i] + "] / " + ichigojamIPaddress[i] + " > " + msg);
                }
            
            //IchigoJamからメッセージが届いたとき
            }else if(errorCheck(msg)) { //IchigoJamからエラーメッセージが送られてきた時は何も返さない
                ichigojam[i].write("");

            //IchigoJamの識別番号と一致した時のみコンソール出力
            }else if(socket.remoteAddress.substr(7) == ichigojamIPaddress[i]){
                // console.log("IPaddress:" + IPaddress,"ichigojamIPaddress[i]:" + ichigojamIPaddress[i]);
                console.log(cliantType + "[" + [i] + "]" + " / " + ichigojamIPaddress[i] + " > " + msg);
            }
        }

        })
        
        socket.on("close" , () => {
            console.log("closed connection.");
        })

        //接続エラー時
        socket.on("error", function(err) {
            console.log("Error occured from connection: " + socket.remoteAddress + ":" + socket.remoteserverPort);
            console.log("Error: %s", err);
        });

    }).listen(serverPort,()=>console.log("listening on tcp server " + serverPort));

    return tcpServer;
}


// process.stdin.resume();

        // process.stdin.on('data', (data) => {
        // ichigojam[0].write(data);
        // });
