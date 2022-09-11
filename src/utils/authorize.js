export default function (req, res, next) {
    const userData = req.loggedInUser.rows[0];
    
    // console.log("userData >>",userData.role);

    if (userData.role !== "super") {
      return next({
        msg: "Sorry, you do not have access",
        status: 403,
      });
    }
    next();
  }
  