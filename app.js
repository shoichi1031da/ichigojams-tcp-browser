const { Client } = require("@line/bot-sdk");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const PORT = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false}));

const relay = require("./public/js/tcpServer");
relay.relayServer(1515);

const net = require('net');
const client = new net.Socket();
const host = "localhost";
const tcpPort = "1515";

client.connect(tcpPort,host,() => {
})

client.on("data" , (data) => {
    let DATA = JSON.parse(data);
    // console.log("data",DATA);
    app.set("ichigojamIPaddresses",DATA);
})

app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", (req,res) => {
    let command = req.body.command;
    let receiveIPaddress = req.body.IPaddress;
    let authentication = false;
    console.log("ブラウザ入力のIPアドレス：" + receiveIPaddress);

    if(app.get("ichigojamIPaddresses")){
        let ichigojamIPaddress = app.get("ichigojamIPaddresses");
        for(const i in ichigojamIPaddress){
            if(receiveIPaddress == ichigojamIPaddress[i].IPaddress) authentication = true;
        }
    }

    if(authentication) {
        console.log("IPアドレス認証に成功しました");
        client.write("%" + receiveIPaddress + "%" + command + "\n");
        res.sendFile(__dirname + "/index.html");
    }else {
        console.log("接続先のIchigoJamのIPアドレスと一致しません");
        res.sendFile(__dirname + "/error.html");
    }

})


server.listen(PORT,() => {
    console.log("listening on http server " + PORT);
})

