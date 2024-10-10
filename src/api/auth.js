// COOKIES
export const checkAuth = (req, res, next) => {
  const userID = req.cookies.userID;

  if (!userID) {
    return res.status(401).send("Unauthorized: Please log in.");
  }

  req.userID = userID;
  next();
};
