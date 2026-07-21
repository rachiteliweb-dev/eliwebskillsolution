const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getFiles(fullPath, filesList);
        } else if (fullPath.endsWith('.tsx')) {
            filesList.push(fullPath);
        }
    }
    return filesList;
}

const teacherDir = 'e:\\Antigravity\\app\\(teacher)';
const files = getFiles(teacherDir);

for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;

    // Text colors
    content = content.replace(/\btext-white\b/g, 'text-[var(--foreground)]');
    content = content.replace(/\btext-slate-400\b/g, 'text-[var(--muted-foreground)]');
    content = content.replace(/\btext-slate-500\b/g, 'text-[var(--muted-foreground)]');
    content = content.replace(/\btext-slate-300\b/g, 'text-[var(--foreground)]');

    // Backgrounds
    content = content.replace(/\bbg-slate-900\/40\b/g, 'bg-[var(--card)]/40');
    content = content.replace(/\bbg-slate-900\b/g, 'bg-[var(--card)]');
    content = content.replace(/\bbg-slate-950\/60\b/g, 'bg-[var(--background)]/60');
    content = content.replace(/\bbg-slate-950\/20\b/g, 'bg-[var(--background)]/20');
    content = content.replace(/\bbg-slate-950\b/g, 'bg-[var(--background)]');
    content = content.replace(/\bbg-slate-800\b/g, 'bg-[var(--secondary)]');
    content = content.replace(/\bbg-slate-850\b/g, 'bg-[var(--secondary)]');

    // Borders
    content = content.replace(/\bborder-slate-800\/80\b/g, 'border-[var(--border)]/80');
    content = content.replace(/\bborder-slate-800\b/g, 'border-[var(--border)]');
    content = content.replace(/\bborder-slate-700\/60\b/g, 'border-[var(--border)]/60');
    content = content.replace(/\bborder-slate-700\b/g, 'border-[var(--border)]');
    content = content.replace(/\bborder-white\/5\b/g, 'border-[var(--border)]');
    content = content.replace(/\bborder-white\/10\b/g, 'border-[var(--border)]');
    
    // Gradients
    content = content.replace(/from-slate-800/g, 'from-[var(--secondary)]');
    content = content.replace(/to-slate-900/g, 'to-[var(--card)]');

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
}
console.log('Teacher files refactoring completed.');
