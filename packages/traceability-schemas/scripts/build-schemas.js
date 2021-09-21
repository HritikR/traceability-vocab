const fs = require('fs');
const path = require('path');

const buildFixturesFromFs = () => {
  const files = fs.readdirSync(path.resolve(__dirname, '../schemas'));

  const fixtures = {};

  files.forEach((fname) => {
     let file;
    try {
        file = fs.readFileSync(path.resolve(__dirname, `../schemas/${fname}`).toString());
         } catch (e) {
      throw new Error(`Unable to read schema file at: ${fname}`);
    }
   try {
      const fixture = JSON.parse(file);
      fixtures[fname.replace('.json', '')] = fixture;
    } catch (e) {
      throw new Error(`Unable to parse JSON schema at: ${fname}`);
    }
  });

  return fixtures;
};

console.log('🧪 build an index.js from a directory of JSON files.');

const map = buildFixturesFromFs();

const requireStatements = Object.keys(map).map((key) => `${key}: require('./schemas/${key}.json'),`);

const indexFile = `
module.exports = {
${requireStatements.join('\n')}
}
`;

const typingsFile = `
export default {
${requireStatements.join('\n')}
}
`;

fs.writeFileSync(path.resolve(__dirname, '../index.js'), indexFile);

fs.writeFileSync(path.resolve(__dirname, '../typings.d.ts'), typingsFile);