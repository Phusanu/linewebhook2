const express = require("express");
const bodyParser = require("body-parser");
const { WebhookClient, Payload } = require("dialogflow-fulfillment");
const port = 4000;

//create server

const app = express();

//middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Welcome , this is a webhook for line Chatbot</h1>");
});

app.post("/webhook", (req, res) => {
  //create webhook client
  const agent = new WebhookClient({
    request: req,
    response: res,
  });
  console.log("Dialogflow Request headers: " + JSON.stringify(req.headers)); //ตรวจสอบ
  console.log("Dialogflow Request body: " + JSON.stringify(req.body)); // ตรวจสอบ
  // มี 3 ฝั่งชั่น
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }

  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function bodyMassIndex(agent) {
    let weight = agent.parameters.weight;
    let height = agent.parameters.height / 100;
    let bmi = (weight / (height * height)).toFixed(2);

    let result = "ขออภัย หนูไม่เข้าใจ";

    if (bmi < 18.5) {
      result = "คุณผอมไป กินข้าวบ้างนะ";
    } else if (bmi >= 18.5 && bmi <= 22.9) {
      result = "คุณหุ่นดีจุงเบย";
    } else if (bmi >= 23 && bmi <= 24.9) {
      result = "คุณเริ่มจะท้วมแล้วนะ";
    } else if ((bmi >= 25.8) & (bmi <= 29.9)) {
      result = "คุณอ้วนละ ออกกำลังกายหน่อยนะ";
    } else if (bmi > 30) {
      result = "คุณอ้วนเกินไปละ หาหมอเหอะ";
    }
    const flexMessage = {
      type: "flex",
      altText: "Flex Message",
      contents: {
        type: "bubble",
        hero: {
          type: "image",
          size: "full",
          aspectRatio: "20:13",
          aspectMode: "cover",
          action: {
            type: "uri",
            uri: "https://line.me/",
          },
          url: "https://bucket.ex10.tech/images/c85ad787-4422-11ef-891c-0242ac120003/originalContentUrl.jpg",
          margin: "none",
        },
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: "ดัชนีมวลกายของคุณคือ",
              weight: "bold",
              size: "sm",
              color: "#0252FF",
            },
            {
              type: "box",
              layout: "vertical",
              margin: "lg",
              spacing: "sm",
              contents: [
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "ส่วนสูงของคุณคือ " + height * 100 + "เซนติเมตร",
                      wrap: true,
                      color: "#009720",
                      size: "sm",
                      margin: "sm",
                    },
                  ],
                },
                {
                  type: "box",
                  layout: "baseline",
                  spacing: "sm",
                  contents: [
                    {
                      type: "text",
                      text: "น้ำหนักของคุณคือ" + weight + "กิโลกรัม",
                      wrap: true,
                      color: "#009720",
                      size: "sm",
                    },
                  ],
                },
                {
                  type: "text",
                  text: "BMI:" + bmi,
                  size: "4xl",
                  color: "#0252FF",
                  align: "center",
                  margin: "none",
                },
              ],
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [],
        },
      },
    };
    //   agent.add(result);
    let payload = new Payload(`LINE`, flexMessage, {
      sendAsMessage: true,
    });
    agent.add(payload);
  }

  function calculateRectangleArea(agent) {
    let width = agent.parameters.width;
    let length = agent.parameters.length;
    let result = width * length;
    agent.add(
      "พื้นที่สี่เหลี่ยม กว้าง" +
        width +
        "ซม ความยาว" +
        length +
        "ซม result" +
        result
    );
  }

  function calculateTriangleArea(agent) {
    let base = agent.parameters.base;
    let height = agent.parameters.height;
    let result = 0.5 * (base * height);
    agent.add(
      `พื้นที่สามเหลี่ยม ฐาน ${base} ซม ความสูง ${height} ซม result: ${result}`
    );
  }

  function calculateCircleArea(agent) {
    let radius = agent.parameters.radius;
    let result = Math.PI * radius * radius;
    agent.add(
      `รัศมีของวงกลมคือ ${radius} พื้นที่ของวงกลมคือ ${result.toFixed(2)}`
    );
  }

  let intentMap = new Map();
  intentMap.set("Default Welcome Intent", welcome);
  intentMap.set("Default Fallback Intent", fallback);
  intentMap.set("BMI - custom - yes", bodyMassIndex);
  intentMap.set("area - rectangle - custom - yes", calculateRectangleArea);
  intentMap.set("area - triangle - custom - yes", calculateTriangleArea);
  intentMap.set("area - circle - custom - yes", calculateCircleArea);
  agent.handleRequest(intentMap);
});

// คอยตรวจสอบด้วยว่าจะมีคนฟังการทำงานเรา เคาะ port 4000 ให้โชว์การทำงาน port ออกมา
app.listen(port, () => {
  console.log("Server is running at http://localhost:" + port);
});
