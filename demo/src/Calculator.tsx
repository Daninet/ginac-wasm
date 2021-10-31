import { useState } from 'react';
import { solve } from './parser/solver';

const DEMO_NOTEBOOK = `digits = 10
degree = 22
pi_expansion = series_to_poly(series(atan(x), x, degree))
pi_approx = 16*subs(pi_expansion, x==(1/5)) - 4*subs(pi_expansion, x==(1/239))
evalf(pi_approx)`;

export const Calculator = ({}) => {
  const [input, setInput] = useState(DEMO_NOTEBOOK);
  type MathResult = { key: number; inputs: string[]; results: string[]; time: number };
  const [result, setResult] = useState<MathResult>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    setLoading(true);
    try {
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
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
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
        &apos;<span style={{ color: '#030e0d' }}>{result.inputs[index]}</span>&apos;<strong>&nbsp;=&nbsp;</strong>&apos;
        <span style={{ color: '#ff0000' }}>{result.results[index]}</span>&apos;
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
        <button disabled={loading} type="submit" style={{ padding: '6px 20px', marginBottom: 20 }}>
          {loading ? 'Loading...' : 'Evaluate'}
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
