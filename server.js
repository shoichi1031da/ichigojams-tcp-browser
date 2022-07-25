const net = require("net");
const PORT = process.env.PORT || 8080; 

const server = net.createServer(socket => {
    socket.write("shoichi.");
    socket.on("data" , data => {
        console.log(data.toString());
    })
})

server.listen(PORT);
