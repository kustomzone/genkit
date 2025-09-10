const fs = require('fs');
const path = require('path');

const CONTEXT_DIR = path.resolve(__dirname, '..', '..', 'context');
const TARGET_DIR = path.resolve(
  __dirname,
  '..',
  'commands',
  'init-ai-tools',
  'context'
);

const jsContextPath = path.resolve(CONTEXT_DIR, 'GENKIT.js.md');
const goContextPath = path.resolve(CONTEXT_DIR, 'GENKIT.go.md');

const AUTO_GEN_HEADER = '// Auto-generated, do not edit';

console.log(CONTEXT_DIR)
// Ensure output directory exists
if (!fs.existsSync(CONTEXT_DIR)) {
  throw new Error('Context dir is missing.');
}

// Ensure context files exists
if (!fs.existsSync(jsContextPath) || !fs.existsSync(goContextPath)) {
  throw new Error('JS/Go context files missing.');
}

async function mdToTs(filePath, target) {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    const cleaned = JSON.stringify(data.trim());
    const final = `${AUTO_GEN_HEADER}\nexport const GENKIT_CONTEXT = ${cleaned}`;
    fs.writeFileSync(target, final);
  } catch (err) {
    console.error('Error reading file:', err);
  }
}

mdToTs(jsContextPath, path.join(TARGET_DIR, 'nodejs.ts'));
mdToTs(goContextPath, path.join(TARGET_DIR, 'go.ts'));
