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
    shuffle(coordsArray[index]).then((coord) => {
      let { x, y, ...other } = coord;
      maxAPI.outlet(`xyz`, index + 1, x , y, 0);
      coordsArray[index] = { x, y, ...other };
    })
  }
}

const shuffle = async (coord) => {
  let { x, y, ...other } = coord;
  let newX = x + (Math.round(Math.random()) * 2 - 1) / 50;
  let newY = y + (Math.round(Math.random()) * 2 - 1) / 50;

  if (newX >= -2 && newX <= 2) {
    x = newX;
  }
  if (newY >= -2 && newY <= 2) {
    y = newY;
  }

  return { x, y, ...other };
} 

const spinMovement = (direction) => {
  for (let index = 0; index < coordsArray.length; index++) {
    spinner(coordsArray[index], direction).then(({x,y, ...other}) => {
      maxAPI.outlet(`xyz`, index + 1, x , y, 0);
      coordsArray[index] = { x, y, ...other };
    })

  }
}

const spinner = async (coord, direction) => {
  let { x, y, ...other } = coord;
  let angle = 0;
  if (direction === LEFT) {
    angle = 3 * (Math.PI / -180);
  } else {
    angle = 3 * (Math.PI / 180);
  }
  let newX = (x * Math.cos(angle) + y * Math.sin(angle));
  let newY = (y * Math.cos(angle) - x * Math.sin(angle));
  x = newX;
  y = newY;

  return { x, y, ...other };
}

const pulsMovement = (...args) => {
  let vectorSize = args[0];
  for (let index = 0; index < coordsArray.length; index++) {
    puls(coordsArray[index], vectorSize).then(({ x, y, currentPuls, ...other }) => {
      maxAPI.outlet(`xyz`, index + 1, x , y, 0);
      coordsArray[index] = { x, y, currentPuls, ...other };
    });
  }
}

const puls = async (coord, vectorSize) => {
  let { x, y, currentPuls, ...other } = coord;
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

  return { x, y, currentPuls, ...other };
}

const handlers = {
  "number": addRemovePoint,
  "shufflemovement": shuffleMovement,
  "spinmovement": spinMovement,
  "puls": pulsMovement
};

maxAPI.addHandlers(handlers);
