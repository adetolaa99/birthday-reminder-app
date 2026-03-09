const { connectDB } = require("../../config/dbConfig.js");
const { addUser } = require("../../controllers/userController.js");

let isConnected = false;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  return addUser(req, res);
}
