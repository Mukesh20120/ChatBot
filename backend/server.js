import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.json({ success: true, message: "server is running successfully" })
})
const rangeValue = (start,end)=>{
    return start + (Math.random()*(end-start));
}
io.on("connection", (socket) => {
    console.log('a user is connected', socket.id);
    setTimeout(() => {
        socket.emit("Greeting", {
            user: "server",
            message: "Hello how can i help you?",
            isUnread: true
        })
    },3000);
    socket.on("New_Message", (data) => {
       setTimeout(()=>{
          socket.emit("Read_Message");
       },rangeValue(2000,3500));
       setTimeout(()=>{
          socket.emit("Is_Typing");
       },rangeValue(3500,5000));
       setTimeout(()=>{
          socket.emit("Reply_Message",{
            user: "server",
            message: "That is the good question?",
            isUnread: true
          });
       },rangeValue(5000,6500));

    })
    socket.on('disconnect', () => {
        console.log('user has disconnected -_-')
    })
})
server.listen(4000, () => {
    console.log("server is running 4000...");
})
