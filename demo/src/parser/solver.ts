let solverworker = null;
let inited = false;

const promises = [];

export const initSolver = () => {
  return new Promise<void>(resolve => {
    solverworker = new Worker(new URL('./solverworker.ts', import.meta.url));
    solverworker.onmessage = e => {
      // console.log('master got message', e.data);
      if (!inited) {
        inited = true;
        resolve();
      } else {
        const resolver = promises.shift();
        resolver(e.data);
      }
    };
  });
};

type SolveResponseType = {
  input: string;
  string: string;
  error?: string;
  json: string;
  latex: string;
  tree: string;
};

export const solve = (lines: string[]) => {
  return new Promise<SolveResponseType[]>(resolve => {
    promises.push(resolve);
    solverworker.postMessage({ lines });
  });
};
