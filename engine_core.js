const maxAPI = require('max-api');

let coordsArray = [];

const addPoints = (pointsCount) => {
  for (let index = coordsArray.length + 1; index < pointsCount; index++) {
    const x = Math.random() * (Math.round(Math.random()) * 2 - 1);
    const y = Math.random() * (Math.round(Math.random()) * 2 - 1);
    coordsArray.push({
      x,
      y
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
    let { x, y } = coordsArray[index];
    let newX = x + (Math.round(Math.random()) * 2 - 1) / 10;
    let newY = y + (Math.round(Math.random()) * 2 - 1) / 10;

    if (newX >= -2 && newX <= 2) {
      x = newX;
    }
    if (newY >= -2 && newY <= 2) {
      y = newY;
    }
    maxAPI.outlet(`xyz`, index + 1, x , y, 0);
    coordsArray[index] = { x, y };
  }
}

const spinMovement = () => {
  for (let index = 0; index < coordsArray.length; index++) {
    let { x, y } = coordsArray[index];
    let newX = x + (Math.cos(22.5) * 1);
    let newY = y + (Math.sin(22.5) * 1);

    if (newX >= -2 && newX <= 2) {
      x = newX;
    }
    if (newY >= -2 && newY <= 2) {
      y = newY;
    }
    maxAPI.outlet(`xyz`, index + 1, x , y, 0);
    coordsArray[index] = { x, y };
  }
}

const handlers = {
  "number": addRemovePoint,
  "shufflemovement": shuffleMovement,
  "spinmovement": spinMovement,
};

maxAPI.addHandlers(handlers);
