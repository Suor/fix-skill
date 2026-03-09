#!/usr/bin/env node
const {readFileSync} = require('fs'), {join} = require('path');
const args = process.argv.slice(2), dir = join(__dirname, 'parts');
const sep = args.indexOf('--');
const conf = sep < 0 ? args : args.slice(0, sep);
const flags = sep < 0 ? [] : args.slice(sep + 1).flatMap(a => a.split(/\s+/)).filter(Boolean);

const hasFlag = spec => { const [s, l] = spec.split('/'), ch = s[1];
  return flags.some(a => a === s || a === l || (a.startsWith('-') && !a.startsWith('--') && a.includes(ch))); };

const dispatch = c => {
  if (c[0] === 'rest') {
    const chars = c.slice(1).map(s => s.split('/')[0][1]), longs = c.slice(1).map(s => s.split('/')[1]);
    const rest = flags.filter(a => !longs.includes(a)
      && !(a.startsWith('-') && !a.startsWith('--') && [...a.slice(1)].every(ch => chars.includes(ch))));
    return rest.length ? rest.join(' ') : '';
  }
  const [spec, t, f] = c, file = hasFlag(spec) ? t : f;
  return file ? readFileSync(join(dir, file), 'utf8').trimEnd() : '';
};

if (conf[0] === 'render') {
  const renumber = conf.includes('--renumber');
  let n = 0, out = readFileSync(join(__dirname, conf[1] + '.md'), 'utf8')
    .replace(/!`([^`]*)`/g, (_, inner) => dispatch(inner.trim().split(/\s+/)) ?? '');
  process.stdout.write(renumber ? out.replace(/^#\./gm, () => ++n + '.') : out);
} else {
  process.stdout.write(dispatch(conf));
}
