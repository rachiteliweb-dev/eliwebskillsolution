const fs = require('fs');

const files = [
    'e:\\Antigravity\\app\\(teacher)\\teacher\\courses\\new\\page.tsx',
    'e:\\Antigravity\\app\\(teacher)\\teacher\\courses\\[id]\\edit\\edit-course-client.tsx',
    'e:\\Antigravity\\app\\(teacher)\\teacher\\page.tsx',
    'e:\\Antigravity\\app\\(admin)\\admin\\approvals\\approvals-list.tsx',
    'e:\\Antigravity\\app\\(student)\\student\\enroll\\[courseId]\\enroll-form.tsx',
    'e:\\Antigravity\\app\\(student)\\student\\learn\\[courseId]\\learn-player.tsx',
    'e:\\Antigravity\\app\\(student)\\student\\learn\\[courseId]\\page.tsx',
    'e:\\Antigravity\\app\\(student)\\student\\page.tsx'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf-8');
    const original = content;

    // Use regex to find elements with bg-indigo, bg-blue, bg-violet, bg-gradient, etc AND text-[var(--foreground)]
    // This is tricky with simple regex because the order varies. 
    // Instead, I'll just look for standard primary button classes and fix them.

    content = content.replace(/hover:to-violet-700 text-\[var\(--foreground\)\]/g, 'hover:to-violet-700 text-white');
    content = content.replace(/bg-indigo-500 hover:bg-indigo-600 text-\[var\(--foreground\)\]/g, 'bg-indigo-500 hover:bg-indigo-600 text-white');
    content = content.replace(/bg-emerald-500 hover:bg-emerald-600 text-\[var\(--foreground\)\]/g, 'bg-emerald-500 hover:bg-emerald-600 text-white');
    content = content.replace(/text-\[var\(--foreground\)\](.*?)bg-indigo-500/g, 'text-white$1bg-indigo-500');
    content = content.replace(/text-\[var\(--foreground\)\](.*?)from-indigo-500/g, 'text-white$1from-indigo-500');

    // For cases where text-[var(--foreground)] comes AFTER the bg class:
    const regex = /(bg-(?:indigo|blue|violet|emerald|amber|rose)-(?:500|600)|bg-gradient-[^\s"]*)[^"]*?text-\[var\(--foreground\)\]/g;
    content = content.replace(regex, (match) => {
        return match.replace('text-[var(--foreground)]', 'text-white');
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf-8');
        console.log(`Reverted text color in ${file}`);
    }
}
