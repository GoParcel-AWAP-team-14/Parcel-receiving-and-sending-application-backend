const bcrypt = require("bcrypt");
async function addUser(req, res, next) {
  try {
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "User Created Successfully",
    });
  } catch (error) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
}

module.exports = {
  addUser,
};
