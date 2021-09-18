const socket = io();

// Elements
const form = document.querySelector("#message-form");
const messageInput = document.querySelector("#message");
const locationBtn = document.querySelector("#location-btn");
const submitBtn = document.querySelector("#submit-btn");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector(".chat__sidebar");

// User Details
const query = Qs.parse(location.search, {ignoreQueryPrefix: true});

// Socket Events
socket.emit("join", query, (error) => {
    if(error){
        alert(error);
        location.href = "/"
    }
});

socket.on("roomData", (roomData) => {
    sidebar.innerHTML = sidebarTemplate(roomData);
})

socket.on("message", (message) => {
    messages.insertAdjacentHTML("beforeend", messageTemplate(message));
});

socket.on("locationMessage", (message) => {
    messages.insertAdjacentHTML("beforeend", locationTemplate(message));
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    const message = messageInput.value;

    socket.emit("sendMessage", message,  (error) => {
        submitBtn.disabled = false;
        messageInput.value = "";
        messageInput.focus();
        if(error){
            alert(error);
        }
    });
});

locationBtn.addEventListener("click", () => {
    if(!navigator.geolocation){
        return alert("Your browser doesnt support location sharing!");
    }

    locationBtn.disabled = true;

    navigator.geolocation.getCurrentPosition((position) => {
        const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        socket.emit("sendLocation", location, (error) => {
            locationBtn.disabled = false;

            if(error){
                alert(error);
            }
        });
    })
});

// Templates
const messageTemplate = (message) => {
    return `
        <div class="message">
            <p>
                <span class="message__name">${message.username}</span>
                <span class="message__meta">${moment(message.createdAt).format("h:mm a")}</span>
            </p>
            <p>${message.text}</p>
        </div>
    `;
}

const locationTemplate = (message) => {
    return `
        <div class="message">
            <p>
                <span class="message__name">${message.username}</span>
                <span class="message__meta">${moment(message.createdAt).format("h:mm a")}</span>
            </p>
            <p><a target="_blank" href=${message.url}>My location</a></p>
        </div>
    `;
}

const sidebarTemplate = (roomData) => {
    var usersHtml = "";

    roomData.users.forEach((user) => {
        usersHtml += `
            <li>${user.username}</li>
        `;
    });

    return `
        <h2 class="room-title">${roomData.room}</h2>
        <h3 class="list-title">Users</h3>
        <ul class="users">
            ${usersHtml}
        </ul>
    `
}