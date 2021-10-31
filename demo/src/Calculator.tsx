import { useState } from 'react';
import { solve } from './parser/solver';

export const Calculator = ({}) => {
  const [input, setInput] = useState('');
  type MathResult = { key: number; inputs: string[]; results: string[]; time: number };
  const [result, setResult] = useState<MathResult>(null);

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    const start = performance.now();
    const lines = input.split('\n').filter(x => !!x.trim());
    const results = await solve(lines);
    const end = performance.now();

    setResult({
      key: Date.now(),
      inputs: lines,
      results,
      time: end - start,
    });
  };

  const printResult = (index: number) => {
    return (
      <div
        key={result.inputs[index] + result.results[index] + Date.now()}
        style={{
          padding: 3,
          wordBreak: 'break-word',
          margin: '10px 0',
          background: '#eee',
          fontFamily: 'monospace',
        }}
      >
        {result.inputs[index]} <strong>=</strong> {result.results[index]}
      </div>
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <textarea
          rows={5}
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: '6px 3px', minWidth: '100%', marginBottom: 10, fontFamily: 'monospace' }}
        />
        <button type="submit" style={{ padding: '6px 20px', marginBottom: 20 }}>
          Evaluate
        </button>
      </form>
      <div style={{ textAlign: 'left' }}>
        {result ? (
          <>
            {result.results.map((_, index) => printResult(index))}
            <strong>Executed in {result.time.toFixed(1)} ms</strong>
          </>
        ) : null}
      </div>
    </>
  );
};
