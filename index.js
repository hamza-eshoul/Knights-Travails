function createCoordArr() {
  let coordArr = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      coordArr.push([i, j]);
    }
  }

  return coordArr;
}

function generatePossibleCoordinates(coord) {
  // top
  const topLeft = [coord[0] + 2, coord[1] - 1];
  const topRight = [coord[0] + 2, coord[1] + 1];
  // bottom
  const bottomLeft = [coord[0] - 2, coord[1] - 1];
  const bottomRight = [coord[0] - 2, coord[1] + 1];
  // left
  const leftTop = [coord[0] + 1, coord[1] - 2];
  const leftBottom = [coord[0] - 1, coord[1] - 2];
  // right
  const rightTop = [coord[0] + 1, coord[1] + 2];
  const rightBottom = [coord[0] - 1, coord[1] + 2];

  const possibleCoordinates = [
    topLeft,
    topRight,
    leftTop,
    rightTop,
    leftBottom,
    rightBottom,
    bottomLeft,
    bottomRight,
  ];

  const filterCoordinates = possibleCoordinates.filter((coord) => {
    return coord[0] >= 0 && coord[0] <= 7 && coord[1] >= 0 && coord[1] <= 7;
  });

  return filterCoordinates;
}

function generateGraphList(arr) {
  const obj = {};

  for (const key of arr) {
    obj[key] = generatePossibleCoordinates(key);
  }

  return obj;
}

class KnightGraph {
  constructor() {
    this.GraphList = generateGraphList(createCoordArr());
  }

  knightMoves(xCord, yCord, arrQueue = [xCord], arrPath = []) {
    if (arrQueue.length == 0) {
      return;
    }

    if (arrQueue[0][0] == yCord[0] && arrQueue[0][1] == yCord[1]) {
      const optimalPath = filterPath(arrPath, yCord);
      const movesNbr = optimalPath.length - 1;

      console.log(
        `You made it in ${movesNbr} ${
          movesNbr > 1 ? "moves!" : "move!"
        } Here's your path:`,
        optimalPath
      );

      return optimalPath;
    }

    // recursive logic

    const cordChildren = this.GraphList[`${arrQueue[0][0]},${arrQueue[0][1]}`];
    arrPath.push({ [arrQueue[0]]: cordChildren });

    for (let i = 0; i < cordChildren.length; i++) {
      const coord = cordChildren[i];

      if (coord[0] == yCord[0] && coord[1] == yCord[1]) {
        arrQueue[0] = coord;
        return this.knightMoves(xCord, yCord, arrQueue, arrPath);
      } else {
        arrQueue.push(coord);
      }
    }

    arrQueue.shift();

    return this.knightMoves(xCord, yCord, arrQueue, arrPath);
  }
}

const newGraph = new KnightGraph();

function filterPath(arrPath, yCord) {
  const arrPathEnd = arrPath[arrPath.length - 1];
  const arrPathStart = arrPath[0];

  const arrPathEndTransformed = transformUniqueObjectToArr(arrPathEnd);
  const arrPathStartTransformed = transformUniqueObjectToArr(arrPathStart);

  const result = [arrPathEndTransformed, yCord];

  function findParentRecursive(arrPath, child) {
    // base case
    if (
      child[0] == arrPathStartTransformed[0] &&
      child[1] == arrPathStartTransformed[1]
    ) {
      return;
    }

    // recursive logic
    let shouldLoopStop = false;

    for (let i = 0; i < arrPath.length; i++) {
      if (shouldLoopStop == true) {
        return;
      }
      for (const property in arrPath[i]) {
        const objectValue = arrPath[i][property];

        objectValue.map((e) => {
          if (e[0] == child[0] && e[1] == child[1]) {
            const myArr = property.split(",");
            myArr[0] = +myArr[0];
            myArr[1] = +myArr[1];

            result.unshift(myArr);
            shouldLoopStop = true;

            findParentRecursive(arrPath, myArr);
          }
        });
      }
    }
  }

  findParentRecursive(arrPath, arrPathEndTransformed);

  return result;
}

function transformUniqueObjectToArr(uniqueObj) {
  for (const property in uniqueObj) {
    const newArr = property.split(",");
    newArr[0] = +newArr[0];
    newArr[1] = +newArr[1];
    return newArr;
  }
}
newGraph.knightMoves([3, 3], [0, 0]);
