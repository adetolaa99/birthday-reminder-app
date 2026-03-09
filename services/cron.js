/*
const cron = require("node-cron");
const User = require("../models/userModel.js");
const { sendBirthdayEmail } = require("../services/emailService.js");

function setupCronJob() {
  cron.schedule("1 23 * * *", async () => {
    console.log(
      "Daily birthday cron job running at:",
      new Date().toISOString(),
    );

    const now = new Date();
    const nigerianTime = new Date(now.getTime() + 1 * 60 * 60 * 1000);
    const todayFormatted = `${String(nigerianTime.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(nigerianTime.getDate()).padStart(2, "0")}`;

    console.log("Nigerian time:", nigerianTime.toISOString());
    console.log("Checking for birthdays on:", todayFormatted);

    try {
      const birthdayUsers = await User.aggregate([
        {
          $project: {
            name: 1,
            email: 1,
            dob: 1,
            dobMonthDay: {
              $substr: ["$dob", 5, 5],
            },
          },
        },
        {
          $match: {
            dobMonthDay: todayFormatted,
          },
        },
      ]);

      console.log(
        `Found ${birthdayUsers.length} birthday users:`,
        birthdayUsers.map((u) => u.email),
      );

      if (birthdayUsers.length === 0) {
        console.log("No users with birthdays today");
      } else {
        for (const user of birthdayUsers) {
          console.log("Sending birthday email to:", user.email);
          try {
            await sendBirthdayEmail(user.email, user.name);
            console.log("Birthday email sent successfully to:", user.email);
          } catch (emailError) {
            console.error(
              "Failed to send birthday email to:",
              user.email,
              emailError,
            );
          }
        }
      }
    } catch (error) {
      console.error("Error in birthday cron job:", error);
    }
  });

  console.log("Birthday cron job scheduled for 12AM WAT");
}

module.exports = setupCronJob;
*/