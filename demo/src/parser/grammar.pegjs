{
  const unroll = options.util.makeUnroll(location, options);
  const g = options.g;
  const prevValues = options.prevValues;
}


start
  = _ line:statement? _ comment:comment? {
    return line ?? { expr: g.numeric('0') };
  }


comment
  = ('#' / '//' / '\\\\') text:$(.*)


statement
  = 'digits' _ '=' _ num:base10_digits {
    return { expr: g.digits(Number(num)) };
  }
  / id:$id _ '=' _ expr:expression {
    return { id, expr };
  }
  / expr:expression {
    return { expr };
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
    switch(op) {
      case '==':
        return g.equal(exprl, exprr);
      case '<=':
        return g.lessThanOrEqualTo(exprl, exprr);
      case '<':
        return g.lessThan(exprl, exprr);
      case '>':
        return g.greaterThan(exprl, exprr);
      case '>=':
        return g.greaterThanOrEqualTo(exprl, exprr);
      case '!=':
        return g.notEqual(exprl, exprr);
    }
  }


expression_math
  = bitwise_or


// lowest priority
bitwise_or
  = head:bitwise_xor tail:(_ ('|' / 'or') _ bitwise_xor)* {
    if (tail.length === 0) return head;
    const values = unroll(head, tail, 3);
    let ret = values.shift();
    values.forEach((op, index) => {
      ret = g.or(ret, values[index + 1]);
    });
    return ret;
  }


bitwise_xor
  = head:bitwise_and tail:(_ 'xor' _ bitwise_and)* {
    if (tail.length === 0) return head;
    const values = unroll(head, tail, 3);
    let ret = values.shift();
    values.forEach((op, index) => {
      ret = g.xor(ret, values[index + 1]);
    });
    return ret;
  }


bitwise_and
  = head:bitshift tail:(_ ('&' / 'and') _ bitshift)* {
    if (tail.length === 0) return head;
    const values = unroll(head, tail, 3);
    let ret = values.shift();
    values.forEach((op, index) => {
      ret = g.and(ret, values[index + 1]);
    });
    return ret;
  }

bitshift
  = head:sum tail:(_ ('<<' / '>>') _ sum)* {
    if (tail.length === 0) return head;
    const operators = unroll(null, tail, 1);
    const values = unroll(head, tail, 3);
    let ret = values[0];
    operators.forEach((op, index) => {
      if (op === '<<') {
        ret = g.shiftLeft(ret, values[index + 1]);
      } else {
        ret = g.shiftRight(ret, values[index + 1]);
      }
    });
    return ret;
  }


sum
  = head:product tail:(_ ('+' / '-') _ product)* {
    if (tail.length === 0) return head;
    const operators = unroll(null, tail, 1);
    const values = unroll(head, tail, 3);
    let ret = values[0];
    operators.forEach((op, index) => {
      if (op === '+') {
        ret = g.add(ret, values[index + 1]);
      } else {
        ret = g.sub(ret, values[index + 1]);
      }
    });
    return ret;
  }


product
  = head:exponential tail:product_tail* {
    if (tail.length === 0) return head;

    let ret = head;
    tail.forEach(([op, expr]) => {
      if (op === '*') {
        ret = g.mul(ret, expr);
      } else {
        ret = g.div(ret, expr);
      }
    });

    return ret;
  }


product_op
  = '*'
  / '/'


product_tail
  = _ !([^([{a-zA-Z]) expr:exponential {
    return ['*', expr];
  }
  / _ op:product_op _ expr:exponential {
    return [op, expr];
  }


exponential
  = head:bitwise_not tail:(_ ('^' / '**') _ bitwise_not)* {
    if (tail.length === 0) return head;
    const params = unroll(head, tail, 3);
    let ret = params[params.length - 1];
    for (let i = params.length - 2; i >= 0; i--) {
      ret = g.pow(params[i], ret);
    }
    return ret;
  }


bitwise_not
  = ('~' / 'not') _ factor:factor {
    return g.not(factor);
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
  = [a-z_]+ {
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
      return g.mul(fn, g.numeric('-1'));
    }
    return fn;
  }
  / negative:negative_sign expr:parantheses_expression {
    if (negative) {
      return g.mul(fn, g.numeric('-1'));
    }
    return expr;
  }
  / val:value {
    return val;
  }


parantheses_expression
  = '(' _ expr:expression _ ')' {
    return g.ex(expr);
  }


value
  = numeric_value
  / negative:negative_sign id:id {
    if (negative) {
      return g.mul(id, g.numeric('-1'));
    }
    return id;
  }
  / list_value
  / matrix_value


list_value
  = '{' _ head:expression tail:( _ ',' _ expression _ )* _ '}' {
    const params = unroll(head, tail, 3);
    return g.lst(params);
  }


matrix_value
  = '[' _ head:matrix_row tail:( _ ',' _ matrix_row _ )* _ ']' {
    const rows = unroll(head, tail, 3);
    const numColumns = Math.max(...rows.map(i => i.length));
    const listItems = [];
    rows.forEach(row => {
      listItems.push(...row);
      if (row.length < numColumns) {
        const rem = numColumns - row.length;
        const remItems = [...new Array(rem)].map(() => g.numeric('0'));
        listItems.push(...remItems);
      }
    });
    return g.matrix(rows.length, numColumns, listItems);
  }


matrix_row
  = '[' _ head:expression tail:( _ ',' _ expression _ )* _ ']' {
    const params = unroll(head, tail, 3);
    return params;
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
    if (prevValues[id] !== undefined) {
      return g.ref(prevValues[id]);
    }
    return g.symbol(id);
  }

_
  = whitespace?


whitespace
  = (' ' / '\t' / '\r' / '\n')+ {
    return text();
  }
