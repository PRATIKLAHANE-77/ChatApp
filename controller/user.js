const user = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "secretkey");
}

exports.signup = async (req, res) => {
  const { name, email, password, number } = req.body;

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
        number,
      });
      // res.status(201).json(newUser); not pass credentials
      const successMessage = "User created successfully";
      res.status(201).json({ message: successMessage });
    });
  } catch (error) {
    res.status(500).json("Error creating the user.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await user.findOne({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(404).json("User does not exist");
    }

    // Compare the entered password with the stored hashed password
    bcrypt.compare(password, existingUser.password, (err, result) => {
      if (err || !result) {
        return res.status(401).json("Invalid password");
      }
      // res.status(200).json(existingUser);

      res.status(200).json({ token: generateAccessToken(existingUser.id) });
    });
  } catch (error) {
    res.status(500).json("Error signing in");
  }
};
