#!/usr/bin/env node
const {readFileSync} = require('fs'), {join} = require('path');
const args = process.argv.slice(2), dir = join(__dirname, 'parts');
const sep = args.indexOf('--');
const conf = sep === -1 ? args : args.slice(0, sep);
const user = sep === -1 ? [] : args.slice(sep + 1).flatMap(a => a.split(/\s+/)).filter(Boolean);
const hasFlag = (spec) => {
  const [short, long] = spec.split('/');
  const ch = short[1];
  return user.some(a => a === short || a === long || (a.startsWith('-') && !a.startsWith('--') && a.includes(ch)));
};
if (conf[0] === 'render') {
  const renumber = conf.includes('--renumber');
  const tpl = readFileSync(join(__dirname, conf[1] + '.md'), 'utf8');
  const expanded = tpl.split('\n').map(line => {
    const m = line.match(/^!`(.+)`$/);
    if (!m) return line;
    const [spec, ifTrue, ifFalse] = m[1].match(/'[^']+'|\S+/g);
    const f = hasFlag(spec.replace(/'/g, '')) ? ifTrue : ifFalse;
    return f ? readFileSync(join(dir, f), 'utf8').trimEnd() : null;
  }).filter(l => l !== null).join('\n');
  let n = 0;
  const out = renumber ? expanded.replace(/^#\./gm, () => ++n + '.') : expanded;
  process.stdout.write(out);
} else if (conf[0] === 'rest') {
  const specs = conf.slice(1);
  const chars = specs.map(s => s.split('/')[0][1]);
  const longs = specs.map(s => s.split('/')[1]);
  const rest = user.filter(a => {
    if (longs.includes(a)) return false;
    if (a.startsWith('-') && !a.startsWith('--')) return ![...a.slice(1)].every(c => chars.includes(c));
    return true;
  });
  if (rest.length) console.log(rest.join(' '));
} else {
  const [spec, ifTrue, ifFalse] = conf;
  const f = hasFlag(spec) ? ifTrue : ifFalse;
  if (f) process.stdout.write(readFileSync(join(dir, f), 'utf8'));
}
