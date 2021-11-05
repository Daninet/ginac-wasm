import { useCallback, useEffect, useState } from 'react';
import { solve } from './parser/solver';

export const INPUT_FORMAT = [
  { name: 'As written', value: 'raw' },
  { name: 'Function calls', value: 'lib' },
] as const;

export type InputFormatType = typeof INPUT_FORMAT[number]['value'];

export const OUTPUT_FORMAT = [
  { name: 'String', value: 'string' },
  { name: 'LaTeX', value: 'latex' },
  { name: 'Tree', value: 'tree' },
  { name: 'JSON', value: 'json' },
] as const;

export type OutputFormatType = typeof OUTPUT_FORMAT[number]['value'];

interface ResultViewProps {
  inputLines: string[];
  inputFormat: InputFormatType;
  outputFormat: OutputFormatType;
  onEvaluationFinished: () => void;
}

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

type MathResult = {
  key: string;
  error?: string;
  input?: string;
  result?: Awaited<ReturnType<typeof solve>>[0];
};

export const ResultView: React.FC<ResultViewProps> = ({
  inputLines,
  inputFormat,
  outputFormat,
  onEvaluationFinished,
}) => {
  const [time, setTime] = useState(0);
  const [results, setResults] = useState<MathResult[]>(null);

  const onCalculate = useCallback(
    async (lines: string[]) => {
      setTime(0);
      setResults(null);
      try {
        const start = performance.now();
        const solveRes = await solve(lines);
        const end = performance.now();
        setTime(end - start);

        if (typeof solveRes === 'string') {
          setResults([{ key: 'error', error: solveRes }]);
        } else {
          const data = solveRes.map((r, index) => ({
            key: lines[index] + index,
            input: lines[index],
            result: r,
          }));
          setResults(data);
        }
      } catch (err) {
        console.error(err);
      }
      onEvaluationFinished();
    },
    [onEvaluationFinished],
  );

  useEffect(() => {
    onCalculate(inputLines);
  }, [inputLines, onCalculate]);

  const getFormattedResult = (r: MathResult) => {
    if (outputFormat === 'string') return r.result?.string;
    if (outputFormat === 'tree') return r.result?.tree;
    if (outputFormat === 'latex') return r.result?.latex;
    if (outputFormat === 'json') return r.result?.string + '\n' + JSON.stringify(r.result?.json, null, 2);
  };

  const printResult = (r: MathResult) => {
    return (
      <div
        key={r.key}
        style={{
          padding: 3,
          background: '#eee',
          fontFamily: 'monospace',
        }}
      >
        <span style={{ color: '#030e0d', wordBreak: 'break-word' }}>
          {'>>'} {inputFormat === 'raw' ? r.input : r.result?.input ?? ''}
        </span>
        <br />
        <span style={{ color: '#378100', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
          {getFormattedResult(r)}
        </span>
        <br />
      </div>
    );
  };

  return (
    <>
      <div style={{ textAlign: 'left', fontFamily: "'Inconsolata', monospace" }}>
        {results ? (
          <>
            {results[0]?.error ? (
              <span style={{ color: '#ff0000' }}>
                {results[0].error}
                <br />
              </span>
            ) : (
              results.map(r => printResult(r))
            )}
          </>
        ) : (
          'Loading...'
        )}
      </div>
      {time ? <strong style={{ display: 'block', marginTop: 15 }}>Evaluated in {time.toFixed(1)} ms</strong> : null}
    </>
  );
};
