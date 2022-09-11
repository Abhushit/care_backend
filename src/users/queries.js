const getUsers = 'SELECT * from users';

// const checkEmailExists = "SELECT s FROM users s WHERE s.email = $1";
const checkEmailExists = "SELECT * FROM users WHERE email LIKE $1";


const getUserByID = 'SELECT * from users WHERE id = $1';

const addUser = 'INSERT INTO users (firstname, lastname, email, password, role, active) VALUES ($1, $2, $3, $4 $5 $6)';

export default {getUserByID, getUsers, addUser, checkEmailExists};