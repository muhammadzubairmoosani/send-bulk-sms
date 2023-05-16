const { Vonage } = require("@vonage/server-sdk");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const data = req.body;
    console.log(data);
    const vonage = new Vonage({
      apiKey: "383097ed",
      apiSecret: "38tg3qhBIAwEoKvN",
    });

    const smsPromises = data.map((recipient) => {
      return vonage.sms.send({
        to: recipient,
        from: "Vonage APIs",
        text: "Hello World!",
      });
    });

    try {
      const results = await Promise.all(smsPromises);
      results.forEach((result, index) => {
        console.log(result);
      });

      res.status(200).json({ message: "Messages sent successfully" });
    } catch (error) {
      console.error("Error processing the request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

