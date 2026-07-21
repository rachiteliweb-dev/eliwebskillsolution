const fs = require('fs');

const filePath = 'e:\\Antigravity\\app\\(public)\\page.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Precise replacements
content = content.replace(/bg-black text-\[var\(--foreground\)\]/g, 'bg-[var(--background)] text-[var(--foreground)]');
content = content.replace(/bg-black text-white/g, 'bg-[var(--background)] text-[var(--foreground)]');
content = content.replace(/text-white\/70/g, 'text-[var(--muted-foreground)]');
content = content.replace(/text-white\/60/g, 'text-[var(--muted-foreground)]');
content = content.replace(/text-white\/80/g, 'text-[var(--foreground)]');
content = content.replace(/text-white/g, 'text-[var(--foreground)]');
content = content.replace(/bg-white\/5/g, 'bg-black/5 dark:bg-white/5');
content = content.replace(/bg-white\/10/g, 'bg-black/10 dark:bg-white/10');
content = content.replace(/border-white\/10/g, 'border-black/10 dark:border-white/10');
content = content.replace(/border-white\/20/g, 'border-black/20 dark:border-white/20');
content = content.replace(/border-white\/40/g, 'border-black/40 dark:border-white/40');
content = content.replace(/border-\[#070b14\]/g, 'border-[var(--background)]');
content = content.replace(/bg-\[#070b14\]/g, 'bg-[var(--background)]');
content = content.replace(/text-gray-300/g, 'text-[var(--muted-foreground)]');
content = content.replace(/text-gray-200/g, 'text-[var(--foreground)]');

// Update ParticleCanvas
if (!content.includes('useTheme')) {
    content = content.replace('import { useState, useEffect, useRef, useCallback } from "react";', 'import { useState, useEffect, useRef, useCallback } from "react";\nimport { useTheme } from "next-themes";');
}

const canvasOld = 'function ParticleCanvas({ className }: { className?: string }) {';
const canvasNew = 'function ParticleCanvas({ className }: { className?: string }) {\n  const { resolvedTheme } = useTheme();\n  const isDark = resolvedTheme === "dark";';
content = content.replace(canvasOld, canvasNew);

content = content.replace('ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;', 'ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(139, 92, 246, ${alpha * 2})`;');
content = content.replace('ctx.fillStyle = `rgba(56, 189, 248, 0.4)`;', 'ctx.fillStyle = isDark ? `rgba(56, 189, 248, 0.4)` : `rgba(14, 165, 233, 0.5)`;');

// Fix AnimatedHeroVisual
content = content.replace('bg-black/5 dark:bg-white/5 backdrop-blur-sm', 'bg-black/5 dark:bg-white/5 backdrop-blur-sm'); // already done by global replace probably

fs.writeFileSync(filePath, content, 'utf-8');
console.log("Refactored page.tsx for theme support");
