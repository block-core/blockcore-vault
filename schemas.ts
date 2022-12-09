import glob from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';

/** Takes an input of schema namespace and returns the name segment of the file capitalized and prefixed with 'validate'. */
function getId(id: string) {
	const segments = id.substring(id.lastIndexOf('/') + 1, id.lastIndexOf('.')).split('-');
	return segments.map((s) => s[0].toUpperCase() + s.substring(1)).join('');
}

const ajv = new Ajv({
	code: {
		source: true,
		esm: false,
	},
});

const schemas = glob('schemas/**/*.json', { sync: true });

for (let i = 0; i < schemas.length; i++) {
	const file = JSON.parse(readFileSync(schemas[i]).toString());
	ajv.addSchema(file, getId(file.$id));
}

let schemasFile = standaloneCode(ajv);

// Append the ts-nocheck as we can't validate this file properly.
schemasFile = '// @ts-nocheck\r\n' + schemasFile;

writeFileSync('src/schemas.cjs', schemasFile);
