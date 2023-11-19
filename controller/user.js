const user = require("../model/user");
const bcrypt = require("bcrypt");

exports.signup = async (req, res) => {
  const { name, email, password, number } = req.body;
  console.log("req.body", req.body);

  try {
    const existingUser = await user.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json("User with this email already exists.");
    }

    // Hash the password before saving it to the database
    bcrypt.hash(password, 10, async (err, hashedPassword) => {
      if (err) {
        return res.status(500).json("Error hashing the password.");
      }

      const newUser = await user.create({
        name,
        email,
        password: hashedPassword,
        number
      });
      res.status(201).json(newUser);
    });
  } catch (error) {
    res.status(500).json("Error creating the user.");
  }
};