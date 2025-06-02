const users =[]

function findUserByEmail(email) {
    return users.find(user => user.email === email);
}

function createUser(user) {
    users.push(user);
    return user;
}

module.exports = {
    findUserByEmail,
    createUser,
    // getAllUsers: () => users
};
