const { connectDB } = require("../../config/dbConfig.js");
const User = require("../../models/userModel.js");
const { sendBirthdayEmail } = require("../../services/emailService.js");

let isConnected = false;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { secret } = req.query;
  if (!secret || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }

  try {
    const now = new Date();
    const nigerianTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const todayFormatted = `${String(nigerianTime.getMonth() + 1).padStart(2, "0")}-${String(nigerianTime.getDate()).padStart(2, "0")}`;

    console.log(`Cron triggered. Checking birthdays for: ${todayFormatted}`);

    const birthdayUsers = await User.aggregate([
      {
        $project: {
          name: 1,
          email: 1,
          dob: 1,
          dobMonthDay: { $substr: ["$dob", 5, 5] },
        },
      },
      { $match: { dobMonthDay: todayFormatted } },
    ]);

    if (birthdayUsers.length > 0) {
      await Promise.all(
        birthdayUsers.map((user) => sendBirthdayEmail(user.email, user.name)),
      );
    }

    res.json({
      success: true,
      message: `Processed ${birthdayUsers.length} birthdays for ${todayFormatted}`,
    });
  } catch (error) {
    console.error("Cron Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
