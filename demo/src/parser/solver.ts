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

export const solve = (lines: string[]) => {
  return new Promise<{ string: string; error?: string }[]>(resolve => {
    promises.push(resolve);
    solverworker.postMessage({ lines });
  });
};
