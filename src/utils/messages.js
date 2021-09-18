const generateMessage = (username, message) => {
    return {
        text: message,
        createdAt: new Date().toISOString(),
        username: username
    }
}

const generateLocationMsg = (username, url) => {
    return {
        url: url,
        createdAt: new Date().toISOString(),
        username: username
    }
}

module.exports = {
    generateMessage: generateMessage,
    generateLocationMsg: generateLocationMsg
}