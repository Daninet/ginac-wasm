import PEGUtil from 'pegjs-util';
import Tracer from 'pegjs-backtrace';
import parser from './grammar.pegjs';
import { getFactory } from '../../../dist/index.esm.min';

const TRACE_AST = false;
const g = getFactory();

export function parse(str: string, prevValues: Record<string, number>) {
  const tracer = TRACE_AST ? new Tracer(str) : undefined;

  const result = PEGUtil.parse(parser, str, {
    startRule: 'start',
    ...(tracer ? { tracer } : {}),
    g,
    prevValues,
  });

  if (result.error !== null) {
    console.error('Parsing error', result.error);
    if (TRACE_AST) {
      console.log('error', PEGUtil.errorMessage(result.error, true));
      console.log('trace', tracer.getBacktraceString());
      throw new Error(`ERROR: Parsing Failure:\n${PEGUtil.errorMessage(result.error, true).replace(/^/gm, 'ERROR: ')}`);
    }
  }

  return result.ast;
}
