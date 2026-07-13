import swaggerJsdoc from "swagger-jsdoc";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const docsDir = path.join(__dirname, "docs");
const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
console.log('files', files);
const options = {
  definition: { openapi: '3.0.0', info: { title: 'test', version: '1.0.0' } },
  apis: [path.join(__dirname, 'docs', '*.yaml')]
};
const spec = swaggerJsdoc(options);
console.log('swaggerJsdoc paths', Object.keys(spec.paths || {}).length);
console.log('swaggerJsdoc keys', Object.keys(spec));
const spec2 = { openapi: '3.0.0', info: { title: 'test', version: '1.0.0' }, paths: {}, components: {}, tags: [] };
for (const f of files) {
  const doc = YAML.load(path.join(docsDir, f));
  if (doc.paths) Object.assign(spec2.paths, doc.paths);
  if (doc.components) Object.assign(spec2.components, doc.components);
  if (doc.tags) spec2.tags.push(...doc.tags);
}
console.log('manual paths', Object.keys(spec2.paths || {}).length);
console.log(JSON.stringify(Object.keys(spec2.paths).slice(0,10), null, 2));
