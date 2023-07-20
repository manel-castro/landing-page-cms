import nats from "node-nats-streaming";

console.clear();

const stan = nats.connect("pages", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("connected to NATS");

  const data = JSON.stringify({
    id: "123",
    title: "concert",
    price: 20,
  });

  stan.publish("ticket:created", data, () => {
    console.log("Event published");
  });
});