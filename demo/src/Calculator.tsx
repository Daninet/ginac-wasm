import { useCallback, useEffect, useState } from 'react';
import { DEMOS } from './demos';
import { InputFormatType, INPUT_FORMAT, OutputFormatType, OUTPUT_FORMAT, ResultView } from './ResultView';

export const Calculator = ({}) => {
  const currentDemoFromUrl = decodeURIComponent((window.location.hash ?? '#').slice(1));
  const [demoName, setDemoName] = useState(
    DEMOS.find(d => d.name === currentDemoFromUrl) ? currentDemoFromUrl : 'Estimate PI',
  );
  const [inputFormat, setInputFormat] = useState<InputFormatType>(INPUT_FORMAT[0].value);
  const [outputFormat, setOutputFormat] = useState<OutputFormatType>(OUTPUT_FORMAT[0].value);
  const [input, setInput] = useState('');
  const [evaluatedInputs, setEvaluatedInputs] = useState<string[]>([]);
  const [modified, setModified] = useState(false);
  const [loading, setLoading] = useState(false);

  const onCalculate = useCallback((input: string) => {
    setLoading(true);
    const lines = input.split('\n').filter(x => !!x.trim());
    setEvaluatedInputs(lines);
  }, []);

  useEffect(() => {
    setModified(false);
    const newInput = DEMOS.find(d => d.name === demoName).text;
    setInput(newInput);
    onCalculate(newInput);
    window.location.hash = encodeURIComponent(demoName);
  }, [onCalculate, demoName]);

  const onSubmit: React.FormEventHandler = async e => {
    e.preventDefault();
    onCalculate(input);
  };

  const onEvaluationFinished = useCallback(() => {
    setLoading(false);
  }, []);

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
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div>
            <button disabled={loading} type="submit" style={{ padding: '6px 20px', marginBottom: 20 }}>
              Evaluate
            </button>
          </div>
          <div style={{ marginLeft: 15 }}>
            Input format: {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select value={inputFormat} onChange={e => setInputFormat(e.currentTarget.value as InputFormatType)}>
              {INPUT_FORMAT.map(d => (
                <option key={d.name} value={d.value}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginLeft: 15 }}>
            Output format: {/* eslint-disable-next-line jsx-a11y/no-onchange */}
            <select value={outputFormat} onChange={e => setOutputFormat(e.currentTarget.value as OutputFormatType)}>
              {OUTPUT_FORMAT.map(d => (
                <option key={d.name} value={d.value}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
      <ResultView
        inputLines={evaluatedInputs}
        inputFormat={inputFormat}
        outputFormat={outputFormat}
        onEvaluationFinished={onEvaluationFinished}
      />
    </>
  );
};
