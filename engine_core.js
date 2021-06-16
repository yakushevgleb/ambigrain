const maxAPI = require('max-api');

let coordsArray = [];
const LEFT = "left";
const RIGHT = "right";
let direction = '';
const UP = 'up';
const DOWN = 'down';


const addPoints = (pointsCount) => {
  for (let index = coordsArray.length + 1; index < pointsCount; index++) {
    const x = Math.random() * (Math.round(Math.random()) * 2 - 1);
    const y = Math.random() * (Math.round(Math.random()) * 2 - 1);
    const angle = Math.tan(x / y);
    coordsArray.push({
      x,
      y,
      angle,
      currentPuls: 0
    });
    maxAPI.outlet(`xyz`, index, x , y, 0);
  }
}

const removePoints = (pointsCount) => {
  for (let index = coordsArray.length + 1; index >= pointsCount; index--) {
    coordsArray.pop();
    maxAPI.outlet(`delete`, index);
  }
}

const addRemovePoint = (pointsCount) => {
  if (pointsCount > coordsArray.length) {
    addPoints(pointsCount);
  } else {
    removePoints(pointsCount);
  }
}

const shuffleMovement = () => {
  for (let index = 0; index < coordsArray.length; index++) {
    let { x, y, ...other } = coordsArray[index];
    let newX = x + (Math.round(Math.random()) * 2 - 1) / 10;
    let newY = y + (Math.round(Math.random()) * 2 - 1) / 10;

    if (newX >= -2 && newX <= 2) {
      x = newX;
    }
    if (newY >= -2 && newY <= 2) {
      y = newY;
    }
    maxAPI.outlet(`xyz`, index + 1, x , y, 0);
    coordsArray[index] = { x, y, ...other };
  }
}

const spinMovement = (direction) => {
  for (let index = 0; index < coordsArray.length; index++) {
    let { x, y, angle, ...other } = coordsArray[index];
    const radius = Math.sqrt(((x - 0) ** 2) + ((y - 0) ** 2));
    const angleInRadians = 11.25 * Math.PI / 180;
    angle += angleInRadians;
    if (direction === LEFT) {
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
    } else {
      x = Math.sin(angle) * radius;
      y = Math.cos(angle) * radius;
    }

    maxAPI.outlet(`xyz`, index + 1, x , y, 0);
    coordsArray[index] = { x, y, angle, ...other };
  }
}

const pulsMovement = (...args) => {
  let vectorSize = args[0];
  for (let index = 0; index < coordsArray.length; index++) {
    let { x, y, currentPuls, ...other } = coordsArray[index];
    const distance = 0.05;
    if (currentPuls <= 0) {
      direction = UP;
    }
    if (currentPuls >= vectorSize) {
      direction = DOWN;
    }
    if (direction === UP) {
      currentPuls += distance;
      x = Math.sign(x) * (Math.abs(x) + distance);
      y = Math.sign(y) * (Math.abs(y) + distance);
    } else if (direction === DOWN) {
      currentPuls -= distance;
      x = Math.sign(x) * (Math.abs(x) - distance);
      y = Math.sign(y) * (Math.abs(y) - distance);
    }
    maxAPI.outlet(`xyz`, index + 1, x , y, 0);
    coordsArray[index] = { x, y, currentPuls, ...other };
  }
}

const handlers = {
  "number": addRemovePoint,
  "shufflemovement": shuffleMovement,
  "spinmovement": spinMovement,
  "puls": pulsMovement
};

maxAPI.addHandlers(handlers);
