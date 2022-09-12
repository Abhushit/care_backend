import pool from "../../db.js";
import queries from "./queries.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (data) => {
  return (
    jwt.sign({
      id: data.id,
    }, process.env.JWT_SECRET)
  );
};

const getUsers = (req, res) => {
  pool.query(queries.getUsers, (err, result) => {
    if (err) throw err;
    res.status(200).json(result.rows);
  });
};

const addUsers = async (req, res) => {
  const { firstname, lastname, email, password, role, active } = req.body;
  console.log('request users', req);

  let errors = [];

  if (!firstname || !email || !password) {
    errors.push({ msg: "Please enter all the fields" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password is weak!" });
  }

  if (errors.length > 0) {
    res.json({ msg: errors.map((err) => err) });
  } else {
    let hashedPassword = await bcrypt.hash(password, 10);
    //check email exists
    pool.query(queries.checkEmailExists, [email], (err, result) => {
      if (result.rows.length > 0) {
        res.json({ msg: "Email already exists" });
      } else {
        //add to users db
        pool.query(
          queries.addUser,
          [firstname, lastname, email, hashedPassword, role, active],
          (err, result) => {
            if (err) throw err;
            res.status(200).json({
              data: {
                firstname: firstname,
                lastname: lastname,
                email: email,
                role: role,
                active: active
              },
              msg: "User Successfully Registered!",
            });
          }
        );
      }
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
  //check if email matches
  pool.query(queries.checkEmailExists, [email], (err, result) => {
    if (result.rows.length) {
      const user = result.rows[0];
      console.log("user", user);

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          let token = createToken(user);
          console.log("token", token);
          res.json({
            token: token,
            data: {
              id: user.id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              role: user.role,
              active: user.active,
              createdAt: user.createdat
            },
            msg: "Successfully logged in!",
          });
        } else {
          res.json({
            msg: "Password is incorrect",
          });
        }
      });
    } else {
      res.json({
        msg: "Username and password does not match!",
      });
    }
  });
};

export default {
  getUsers,
  addUsers,
  login,
};
