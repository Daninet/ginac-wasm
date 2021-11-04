import { useCallback, useEffect, useState } from 'react';
import { DEMOS } from './demos';
import { solve } from './parser/solver';

export const Calculator = ({}) => {
  const currentDemoFromUrl = decodeURIComponent((window.location.hash ?? '#').slice(1));
  const [demoName, setDemoName] = useState(
    DEMOS.find(d => d.name === currentDemoFromUrl) ? currentDemoFromUrl : 'Estimate PI',
  );
  const [input, setInput] = useState('');
  const [modified, setModified] = useState(false);
  type MathResult = { error?: string; inputs?: string[]; results?: string[]; time: number };
  const [result, setResult] = useState<MathResult>(null);
  const [loading, setLoading] = useState(false);

  const onCalculate = useCallback(async (input: string) => {
    setLoading(true);
    try {
      const start = performance.now();
      const lines = input.split('\n').filter(x => !!x.trim());
      const results = await solve(lines);
      const end = performance.now();

      if (typeof results === 'string') {
        setResult({ error: results, time: end - start });
      } else {
        setResult({
          inputs: lines,
          results: results.map(r => r.string ?? r.error),
          time: end - start,
        });
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    setModified(false);
    const newInput = DEMOS.find(d => d.name === demoName).text;
    setInput(newInput);
    onCalculate(newInput);
    window.location.hash = encodeURIComponent(demoName);
  }, [demoName, onCalculate]);

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    onCalculate(input);
  };

  const printResult = (index: number) => {
    return (
      <div
        key={result.inputs[index] + result.results[index] + Date.now()}
        style={{
          padding: 3,
          background: '#eee',
          fontFamily: 'monospace',
        }}
      >
        <span style={{ color: '#030e0d', wordBreak: 'break-word' }}>
          {'>>'} {result.inputs[index]}
        </span>
        <br />
        <span style={{ color: '#378100', wordBreak: 'break-word' }}>{result.results[index]}</span>
        <br />
      </div>
    );
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 10 }}>
          Demo: {/* eslint-disable-next-line jsx-a11y/no-onchange */}
          <select value={demoName} onChange={e => setDemoName(e.currentTarget.value)}>
            {DEMOS.map(d => (
              <option key={d.name} value={d.name}>
                {demoName === d.name && modified ? `( ${d.name} )` : d.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          rows={8}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setModified(true);
          }}
          onKeyPress={e => (e.ctrlKey && e.code === 'Enter' ? onCalculate(input) : void 0)}
          style={{
            padding: '6px 3px',
            minWidth: '100%',
            marginBottom: 10,
            fontFamily: "'Inconsolata', monospace",
            lineHeight: 1.3,
          }}
        />
        <button disabled={loading} type="submit" style={{ padding: '6px 20px', marginBottom: 20 }}>
          {loading ? 'Loading...' : 'Evaluate'}
        </button>
      </form>
      <div style={{ textAlign: 'left', fontFamily: "'Inconsolata', monospace" }}>
        {result ? (
          <>
            {result.error ? (
              <span style={{ color: '#ff0000' }}>
                {result.error}
                <br />
              </span>
            ) : (
              result.results.map((_, index) => printResult(index))
            )}
          </>
        ) : null}
      </div>
      {result ? (
        <strong style={{ display: 'block', marginTop: 15 }}>Executed in {result.time.toFixed(1)} ms</strong>
      ) : null}
    </>
  );
};
