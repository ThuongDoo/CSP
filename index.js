const data = require("./data.json");
const vertexNumber = data.variable.length;

const graph = Array(vertexNumber)
  .fill(0)
  .map(() => Array(vertexNumber).fill(0));

data.constraint.forEach((expression, index) => {
  const a = data.variable
    .map((item, itemIndex) => {
      if (expression.includes(item)) {
        return itemIndex;
      }
    })
    .filter((item) => item != undefined);
  if (a.length >= 2) {
    graph[a[0]][a[1]] = expression;
    graph[a[1]][a[0]] = expression;
  } else {
    console.error(
      `Không đủ chỉ mục trong biểu thức ${expression} để cập nhật graph.`
    );
  }
  data.constraint[index] = [...a, expression];
});

console.log("GRAPH", graph);
console.log("DATA", data);

const AC_3 = () => {
  const queue = [];
  data.constraint.forEach((item, index) => {
    const [head, tail, express] = data.constraint[index];
    queue.push([head, tail, express]);
    queue.push([tail, head, express]);
  });
  console.log("QUEUE", queue);
  while (queue.length !== 0) {
    console.log("\nLOOP---------\n");
    const edge = queue.shift();
    const [Xi, Xj, expression] = edge;
    console.log("Xi,Xj", edge);
    console.log("QUEUE", queue);
    if (revise(data, Xi, Xj, expression)) {
      if (data.domain[data.variable[Xi]].length === 0) {
        return false;
      }
      for (let i = 0; i < vertexNumber; i++) {
        if (graph[i][Xi] !== 0 && i !== Xj) {
          // console.log("PUSH", i, Xi);
          const pushData = [i, Xi, graph[i][Xi]];
          if (queue.some((item) => item[0] === i && item[1] === Xi)) {
            console.log("U(Xk,Xi)", pushData);
          } else {
            console.log("U(Xk,Xi)", pushData);
            queue.push([i, Xi, graph[i][Xi]]);
          }
        }
      }
    }
    console.log("Dx", data.domain);
  }
  return true;
};

const revise = (csp, Xi, Xj, expression) => {
  let revised = false;
  const headNode = csp.variable[Xi];
  const tailNode = csp.variable[Xj];
  const expressFunction = new Function(
    `${headNode}`,
    `${tailNode}`,
    `return ${expression}`
  );
  const a = csp.domain[headNode].filter((value_i) => {
    const isRevised = csp.domain[tailNode].some((value_j) =>
      expressFunction(value_i, value_j)
    );
    if (!isRevised) {
      revised = true;
    }
    return isRevised;
  });
  csp.domain[headNode] = a;
  return revised;
};

if (AC_3()) {
  console.log("\n\n------RESULT------\n\n");
  console.log("DOMAIN: ", data.domain);
} else {
  console.log("\n\n------RESULT------\n\n");
  console.log("FALSE");
}
