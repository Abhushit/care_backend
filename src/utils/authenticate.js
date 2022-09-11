import jwt from "jsonwebtoken";
// import UserModel from "../model/users.model.js";
import queries from "../users/queries.js";
import pool from "../../db.js";

export default function (req, res, next) {
  let token;
  if (req.headers["authorization"]) token = req.headers["authorization"];
  if (req.headers["x-access-token"]) token = req.headers["x-access-token"];
  if (req.headers["token"]) token = req.headers["token"];
  if (req.query.headers) token = req.query.token;

  if (token) {
    //validation
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) throw err;
      
      pool.query(queries.getUserByID, [decoded.id], (err, user) => {
        if (err){
            return next(err);
        }
        if (!user) {
          return next({
            msg: "User removed from system",
            status: 400,
          });
        }
        req.loggedInUser = user;
        next();
      })
    });
  } else {
    return next({
      msg: "Token not provided",
      status: 400,
    });
  }
}
