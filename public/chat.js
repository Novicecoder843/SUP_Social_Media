const socket = io();

let currentUser = "";

function joinChat(){

    currentUser =
        document.getElementById("userId").value;

    if(!currentUser){
        alert("Enter User ID");
        return;
    }

    socket.emit("join", currentUser);

    alert("Joined as User " + currentUser);
}

function sendMessage(){

    const receiverId =
        document.getElementById("receiverId").value;

    const message =
        document.getElementById("message").value;

    if(message.trim() === "") return;

    socket.emit("send_message", {

        sender_id: currentUser,
        receiver_id: receiverId,
        message: message

    });

    document.getElementById("message").value = "";
}

socket.on("receive_message", (data) => {

    const messages =
        document.getElementById("messages");

    const div = document.createElement("div");

    const isMine =
        data.sender_id == currentUser;

    div.className =
        `message ${isMine ? "sent" : "received"}`;

    div.innerHTML = `

        <div>${data.message}</div>

        <div class="message-time">
            ${new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}
        </div>

    `;

    messages.appendChild(div);

    messages.scrollTop = messages.scrollHeight;
});

socket.on("online_users", (users) => {

    console.log("Online Users:", users);

});

function handleKey(e){

    if(e.key === "Enter"){
        sendMessage();
    }
}