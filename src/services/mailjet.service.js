const Mailjet = require("node-mailjet");

const mailjet = Mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const sendEmail = async (toDoTitle) => {
  try {
    const response = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mluzdesign@gmail.com!!!!!!!!!",
            Name: "Martín Lux",
          },
          To: [
            {
              Email: "martin.luz.garcia2@gmail.com",
              Name: "Martin Luz",
            },
          ],
          Subject: "Nueva ToDo Creada - " + toDoTitle,
          TextPart: "Tienes una nueva to-do en tu lista de tareas",
          HTMLPart: "Tienes una nueva to-do en tu lista de tareas",
        },
      ],
    });
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendEmail;
