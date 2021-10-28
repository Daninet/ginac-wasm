import { useState } from 'react';
import { parse } from './parser';

export const Calculator = ({ ginac }) => {
  const [internalParser, setInternalParser] = useState(true);
  const [input, setInput] = useState('');
  type MathResult = { key: number; input: string; result: string };
  const [results, setResults] = useState<MathResult[]>([]);

  const onSubmit: React.FormEventHandler = e => {
    e.preventDefault();
    let res = '';
    if (internalParser) {
      res = ginac().parsePrint(input);
    } else {
      res = ginac(g => {
        const ast = parse(g, input);
        console.log(`input="${input} parsed="${ast.toString()}"`);
        return ast;
      }).print();
    }

    setResults(prev => [
      ...prev,
      {
        key: Date.now(),
        input,
        result: res,
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
          style={{ padding: '10px 5px', minWidth: '100%', marginBottom: 20 }}
        />
      </form>
      <div style={{ textAlign: 'left' }}>
        {results.map(r => (
          <div key={r.key} style={{ padding: 2 }}>
            {r.input} = {r.result}
          </div>
        ))}
      </div>
    </>
  );
};
