const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBirthdayEmail = async (email, name) => {
  const firstName = name.split(" ")[0];

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: email,
    subject: "Happy Birthday!",
    text: `Happy Birthday ${firstName}!\n\nI hope your special day is filled with joy, laughter and unforgettable memories. You deserve a wonderful day and I'm so glad I get to be part of it, even in a small way :)\n\nEnjoy every moment and cheers to the year ahead!\n\nWith warm wishes,\nAdetola\nYour Birthday, Remembered`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Happy Birthday</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f4f4; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center;">

          <img src="https://gifsec.com/wp-content/uploads/2022/09/happy-birthday-gif-18.gif" alt="Birthday Celebration" style="max-width: 100%; margin: 20px 0; border-radius: 10px;" />

          <h1 style="color: #e91e63;">🎉 Happy Birthday, ${firstName}! 🎂</h1>

          <p style="font-size: 16px; color: #555555; line-height: 1.6;">
            I hope your special day is filled with joy, laughter and unforgettable memories ❤️. You deserve a wonderful day and I'm so glad I get to be part of it, even in a small way :)
          </p>

          <p style="font-size: 16px; color: #555555; line-height: 1.6;">
            Enjoy every moment and cheers to the year ahead! 🥳
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

          <div style="font-size: 14px; color: #999999; line-height: 1.5;">
            With warm wishes,<br/>
            <strong>Adetola 🎀</strong><br/>
            <em>Your Birthday, Remembered</em>
          </div>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("Error sending email:", error);
    throw error;
  }

  console.log("Email sent:", data);
  return data;
};

module.exports = { sendBirthdayEmail };
