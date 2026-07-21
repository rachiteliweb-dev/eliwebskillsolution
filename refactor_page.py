import re

file_path = r'e:\Antigravity\app\(public)\page.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Precise replacements
content = content.replace('bg-black text-[var(--foreground)]', 'bg-[var(--background)] text-[var(--foreground)]')
content = content.replace('bg-black text-white', 'bg-[var(--background)] text-[var(--foreground)]')
content = content.replace('text-white/70', 'text-[var(--muted-foreground)]')
content = content.replace('text-white/60', 'text-[var(--muted-foreground)]')
content = content.replace('text-white/80', 'text-[var(--foreground)]')
content = content.replace('text-white', 'text-[var(--foreground)]')
content = content.replace('bg-white/5', 'bg-black/5 dark:bg-white/5')
content = content.replace('bg-white/10', 'bg-black/10 dark:bg-white/10')
content = content.replace('border-white/10', 'border-black/10 dark:border-white/10')
content = content.replace('border-white/20', 'border-black/20 dark:border-white/20')
content = content.replace('border-white/40', 'border-black/40 dark:border-white/40')
content = content.replace('border-[#070b14]', 'border-[var(--background)]')
content = content.replace('bg-[#070b14]', 'bg-[var(--background)]')
content = content.replace('text-gray-300', 'text-[var(--muted-foreground)]')
content = content.replace('text-gray-200', 'text-[var(--foreground)]')

# Update ParticleCanvas
if 'useTheme' not in content:
    content = content.replace('import { useState, useEffect, useRef, useCallback } from "react";', 'import { useState, useEffect, useRef, useCallback } from "react";\nimport { useTheme } from "next-themes";')

canvas_old = 'function ParticleCanvas({ className }: { className?: string }) {'
canvas_new = 'function ParticleCanvas({ className }: { className?: string }) {\n  const { resolvedTheme } = useTheme();\n  const isDark = resolvedTheme === "dark";'
content = content.replace(canvas_old, canvas_new)

content = content.replace('ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;', 'ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(139, 92, 246, ${alpha * 2})`;')
content = content.replace('ctx.fillStyle = `rgba(56, 189, 248, 0.4)`;', 'ctx.fillStyle = isDark ? `rgba(56, 189, 248, 0.4)` : `rgba(14, 165, 233, 0.5)`;')

# Fix AnimatedHeroVisual
content = content.replace('bg-white/5 backdrop-blur-sm', 'bg-black/5 dark:bg-white/5 backdrop-blur-sm')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Refactored page.tsx for theme support")
