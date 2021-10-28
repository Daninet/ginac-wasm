{
  const unroll = options.util.makeUnroll(location, options);
  const g = options.g;
}


start
  = _ line:(expression)? _ {
    console.log(line.toString());
    return line;
  }


expression
  = _ value:(relation) _ {
    return value;
  }


relation
  = exprl:expression_math rel:(_ ('==' / '<=' / '<' / '>' / '>=' / '!=') _ expression_math)? {
    if (!rel) return exprl;
    const op = rel[1];
    const exprr = rel[3];
    const ret = g.relation(exprl);
    switch(op) {
      case '==':
        return ret.eq(exprr);
      case '<=':
        return ret.lessThanOrEqualTo(exprr);
      case '<':
        return ret.lessThan(exprr);
      case '>':
        return ret.greaterThan(exprr);
      case '>=':
        return ret.greaterThanOrEqualTo(exprr);
      case '!=':
        return ret.neq(exprr);
    }
  }


expression_math
  = bitwise_or


// lowest priority
bitwise_or
  = head:bitwise_xor tail:(_ ('|' / 'or') _ bitwise_xor)* {
    if (tail.length === 0) return head;
    const values = unroll(head, tail, 3);
    const ret = g.ex(values.shift());
    values.forEach((op, index) => {
      ret.or(values[index + 1]);
    });
    return ret;
  }


bitwise_xor
  = head:bitwise_and tail:(_ 'xor' _ bitwise_and)* {
    if (tail.length === 0) return head;
    const values = unroll(head, tail, 3);
    const ret = g.ex(values.shift());
    values.forEach((op, index) => {
      ret.xor(values[index + 1]);
    });
    return ret;
  }


bitwise_and
  = head:bitshift tail:(_ ('&' / 'and') _ bitshift)* {
    if (tail.length === 0) return head;
    const values = unroll(head, tail, 3);
    const ret = g.ex(values.shift());
    values.forEach((op, index) => {
      ret.and(values[index + 1]);
    });
    return ret;
  }

bitshift
  = head:sum tail:(_ ('<<' / '>>') _ sum)* {
    if (tail.length === 0) return head;
    const operators = unroll(null, tail, 1);
    const values = unroll(head, tail, 3);
    const ret = g.ex(values[0]);
    operators.forEach((op, index) => {
      if (op === '<<') {
        ret.shiftLeft(values[index + 1]);
      } else {
        ret.shiftRight(values[index + 1]);
      }
    });
    return ret;
  }


sum
  = head:product tail:(_ ('+' / '-') _ product)* {
    if (tail.length === 0) return head;
    const operators = unroll(null, tail, 1);
    const values = unroll(head, tail, 3);
    const ret = g.ex(values[0]);
    operators.forEach((op, index) => {
      if (op === '+') {
        ret.add(values[index + 1]);
      } else {
        ret.sub(values[index + 1]);
      }
    });
    return ret;
  }


product
  = head:exponential tail:product_tail* {
    if (tail.length === 0) return head;

    const ret = g.ex(head);
    tail.forEach(([op, expr]) => {
      ret[op](expr);
    });

    return ret;
  }


product_op
  = '*' {
    return 'mul';
  }
  / '/' {
    return 'div';
  }


product_tail
  = _ !([^([{a-zA-Z]) expr:exponential {
    return ['mul', expr];
  }
  / _ op:product_op _ expr:exponential {
    return [op, expr];
  }


exponential
  = head:bitwise_not tail:(_ ('^' / '**') _ bitwise_not)* {
    if (tail.length === 0) return head;
    const params = unroll(head, tail, 3);
    let ret = g.ex(params[params.length - 2]).pow(params[params.length - 1]);
    for (let i = params.length - 3; i >= 0; i--) {
      ret = g.ex(params[i]).pow(ret);
    }
    return ret;
  }


bitwise_not
  = ('~' / 'not') _ factor:factor {
    return g.ex(factor).not(); // ast('Not').add(factor);
  }
  / factor


function
  = id:function_name & {
    return g[id] !== undefined;
  } _ params:function_parameters {
    const x = g[id](...params);
    return x;
  }


function_name
  = [a-z]+ {
    return text();
}


function_parameters
  = '(' _ head:expression tail:( _ ',' _ expression _ )* ')' {
    return unroll(head, tail, 3);
  }
  / factor:factor _ {
    return factor;
  }


factor
  = negative:negative_sign fn:function {
    if (negative) {
      return g.ex(fn).mul(g.numeric('-1'));
    }
    return fn;
  }
  / negative:negative_sign expr:parantheses_expression {
    if (negative) {
      return g.ex(fn).mul(g.numeric('-1'));
    }
    return expr;
  }
  / val:value {
    return val;
  }


parantheses_expression
  = s:('(' / '[' / '{') _ expr:expression _ e:(')' / ']' / '}') & {
    if (s === '(') return e === ')';
    if (s === '[') return e === ']';
    if (s === '{') return e === '}';
    return false;
  } {
    return g.ex(expr);
  }


value
  = numeric_value
  / negative:negative_sign id:id {
    if (negative) {
      return g.ex(id).mul(g.numeric('-1'));
    }
    return id;
  }


numeric_value
  = scientific_notation
  / double
  / integer


scientific_notation
  = val:(double / base10_integer / zero_integer) ('e' / 'E') '+'? exp:(base10_integer / zero_integer) {
    const value = val.toString() + 'e' + exp.toString();
    return g.numeric(value);
  }


double
  = whole:(base10_integer / zero_integer)? _ '.' _ frac:(_ base10_digits)* {
    const wholePart = whole !== null ? whole.toString() : '0';
    const value = wholePart + '.' + unroll(null, frac, 1).join('');
    return g.numeric(value);
  }


integer
  = base10_integer
  / zero_integer


base10_integer
  = negative:negative_sign !'0' digits:base10_digits {
    return g.numeric(`${negative ? '-' : ''}${digits}`);
  }


zero_integer
  = negative:negative_sign '0' {
    return g.numeric('0');
  }


base10_digits
  = [0-9]+ {
    return text();
  }


negative_sign
  = sign:('-' _)* {
    return sign.length % 2 === 1;
  }

id
  = id:$([a-zA-Z_][a-zA-Z0-9_]*) {
    return g.symbol(id);
  }

_
  = whitespace?


whitespace
  = (' ' / '\t' / '\r' / '\n')+ {
    return text();
  }
