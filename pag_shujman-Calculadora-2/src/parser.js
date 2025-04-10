export function tokenize(expr) {
  const tokens = [];
  let num = '';

  for (const char of expr) {
    if (/\d|\./.test(char)) {
      num += char;
    } else if (/[+\-*/()]/.test(char)) {
      if (num) {
        tokens.push({ type: 'number', value: parseFloat(num) });
        num = '';
      }
      tokens.push({ type: 'operator', value: char });
    }
  }

  if (num) tokens.push({ type: 'number', value: parseFloat(num) });
  return tokens;
}

function parsePrimary(tokens) {
  const token = tokens.shift();
  if (!token) throw new Error('Unexpected end of input');

  if (token.type === 'number') {
    return { type: 'number', value: token.value };
  }

  if (token.value === '(') {
    const node = parseExpression(tokens);
    const next = tokens.shift();
    if (!next || next.value !== ')') throw new Error('Expected closing parenthesis');
    return node;
  }

  throw new Error('Unexpected token: ' + JSON.stringify(token));
}

function parseMultiplicative(tokens) {
  let node = parsePrimary(tokens);
  while (tokens[0]?.value === '*' || tokens[0]?.value === '/') {
    const op = tokens.shift().value;
    node = { type: 'binary', operator: op, left: node, right: parsePrimary(tokens) };
  }
  return node;
}

function parseExpression(tokens) {
  let node = parseMultiplicative(tokens);
  while (tokens[0]?.value === '+' || tokens[0]?.value === '-') {
    const op = tokens.shift().value;
    node = { type: 'binary', operator: op, left: node, right: parseMultiplicative(tokens) };
  }
  return node;
}

export function buildAST(tokens) {
  return parseExpression(tokens);
}

export function evaluateAST(node) {
  if (node.type === 'number') return node.value;

  const left = evaluateAST(node.left);
  const right = evaluateAST(node.right);

  switch (node.operator) {
    case '+': return left + right;
    case '-': return left - right;
    case '*': return left * right;
    case '/': return right !== 0 ? left / right : NaN;
    default: throw new Error('Unknown operator: ' + node.operator);
  }
}

export function parseAndEvaluate(expr) {
  return evaluateAST(buildAST(tokenize(expr)));
}
