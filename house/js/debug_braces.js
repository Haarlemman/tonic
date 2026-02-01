const fs = require('fs');
const content = fs.readFileSync('house.js', 'utf8');
const lines = content.split('\n');

let balance = { '{': 0, '(': 0, '[': 0 };
let stacks = { '{': [], '(': [], '[': [] };
let inString = null; // null, "'", '"', '`'

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (let j = 0; j < line.length; j++) {
        const char = line[j];

        // Handle strings
        if (inString) {
            if (char === inString && line[j - 1] !== '\\') {
                inString = null;
            }
            continue;
        }
        if (char === "'" || char === '"' || char === '`') {
            inString = char;
            continue;
        }

        // Handle comments (basic)
        if (char === '/' && line[j + 1] === '/') break;

        if (char === '{' || char === '(' || char === '[') {
            balance[char]++;
            stacks[char].push({ line: i + 1, char: j });
        } else if (char === '}' || char === ')' || char === ']') {
            const pair = char === '}' ? '{' : (char === ')' ? '(' : '[');
            balance[pair]--;
            if (balance[pair] < 0) {
                console.log(`Error: Unexpected '${char}' at line ${i + 1} col ${j}`);
                process.exit(1);
            }
            stacks[pair].pop();
        }
    }
}

for (const k in balance) {
    if (balance[k] > 0) {
        console.log(`Error: Unclosed '${k}'. Balance: ${balance[k]}`);
        console.log(`Last unclosed at line ${stacks[k][stacks[k].length - 1].line}`);
    }
}

if (inString) {
    console.log(`Error: Unclosed string literal: ${inString}`);
}

if (Object.values(balance).every(v => v === 0) && !inString) {
    console.log("Braces/Quotes seem balanced.");
}
