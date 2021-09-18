const users = [];

const addUser = (data) => {
    // Validate the data
    if(!data || !data.username || !data.room){
        return {
            error: "Username and room are required"
        }   
    }

    // Clean the data
    const username = data.username.trim().toLowerCase();
    const room = data.room.trim().toLowerCase();

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    });

    if(existingUser){
        return {
            error: "Username is in use!"
        }
    }

    // Store user
    const user = {
        username: username,
        room: room,
        id: data.id
    };

    users.push(user);
    return user;
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id;
    });

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room);
}

module.exports = {
    addUser: addUser,
    removeUser: removeUser,
    getUser: getUser,
    getUsersInRoom: getUsersInRoom
}