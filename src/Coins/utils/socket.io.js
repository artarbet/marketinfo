import io from "socket.io-client";
const socket = io("//coincap.io", { autoConnect: false });

const subscribers = [];

const subscribe = (coin, callback) => {
  subscribers[coin] = callback;
};

const unsubscribe = coin => {
  delete subscribers[coin];
};

socket.on("trades", msg => subscribers[msg.coin] && subscribers[msg.coin](msg));

export { subscribe, unsubscribe };

export default socket;
