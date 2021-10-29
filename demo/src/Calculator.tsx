import { useState } from 'react';
import { parse } from './parser';

export const Calculator = ({ ginac }) => {
  const [internalParser, setInternalParser] = useState(false);
  const [input, setInput] = useState('');
  type MathResult = { key: number; input: string; result: string; time: number };
  const [results, setResults] = useState<MathResult[]>([]);

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    let res = '';
    const start = performance.now();
    try {
      if (internalParser) {
        res = ginac().parsePrint(input);
      } else {
        res = ginac(g => {
          const ast = parse(g, input);
          console.log(`input="${input} parsed="${ast.toString()}"`);
          return ast;
        }, 1000).print();
      }
    } catch (err) {
      console.error(err);
      res = 'Error!';
    }

    const end = performance.now();

    setResults(prev => [
      ...prev,
      {
        key: Date.now(),
        input,
        result: res,
        time: end - start,
      },
    ]);

    setInput('');
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>
          Use GiNaC&apos;s internal parser:
          <input type="checkbox" checked={internalParser} onChange={e => setInternalParser(e.currentTarget.checked)} />
        </label>
        <br />
        <br />
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ padding: '6px 3px', minWidth: '100%', marginBottom: 20 }}
        />
      </form>
      <div style={{ textAlign: 'left' }}>
        {results.map(r => (
          <div key={r.key} style={{ padding: 3, wordBreak: 'break-word', margin: '10px 0', background: '#eee' }}>
            {r.input} <strong>=</strong> {r.result} <strong>({r.time.toFixed(1)} ms)</strong>
          </div>
        ))}
      </div>
    </>
  );
};
