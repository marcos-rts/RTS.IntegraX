const users =[]

function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

function createUser(user) {
    users.push(user);
    return user;
}

function saveRefreshToken(email, refreshToken){
    const user = findUserByEmail(email);
    if (user) {
        user.refreshToken = refreshToken;
    }
}

function removeRefreshToken(email) {
    const user = findUserByEmail(email);
    if (user) {
        user.refreshToken = null;
    }
}

function findUserByRefreshToken(refreshToken) {
    return users.find(user => user.refreshToken === refreshToken);
}

module.exports = {
    findUserByEmail,
    createUser,
    saveRefreshToken,
    removeRefreshToken,
    findUserByRefreshToken,
    // getAllUsers: () => users
};
