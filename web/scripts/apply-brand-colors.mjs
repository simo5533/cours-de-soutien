/**
 * Remplace les anciennes couleurs (teal/indigo/amber) par la charte
 * navy / gold / brandblue. Ordre important : chaînes longues d'abord.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcRoot = path.join(__dirname, "..", "src");

const REPLACEMENTS = [
  ["from-teal-600 to-teal-800", "from-navy to-navy"],
  ["dark:from-teal-500 dark:to-teal-700", "dark:from-brandblue dark:to-navy"],
  ["shadow-teal-900/15", "shadow-navy/20"],
  ["shadow-teal-950/40", "shadow-navy/30"],
  ["from-teal-500 to-emerald-600", "from-brandblue to-navy"],
  ["from-indigo-500 to-violet-600", "from-navy to-brandblue"],
  ["from-amber-500 to-orange-600", "from-gold to-navy"],
  ["hover:bg-teal-400", "hover:bg-brandblue/90"],
  ["dark:hover:bg-teal-400", "dark:hover:bg-brandblue"],

  ["ring-teal-500/50", "ring-brandblue/50"],
  ["ring-teal-500/35", "ring-brandblue/35"],
  ["ring-teal-500/30", "ring-brandblue/30"],
  ["ring-teal-500/25", "ring-brandblue/25"],
  ["ring-teal-500/20", "ring-brandblue/20"],
  ["ring-teal-400/50", "ring-brandblue/50"],
  ["ring-teal-400/30", "ring-brandblue/30"],
  ["ring-teal-400/25", "ring-brandblue/25"],
  ["ring-teal-400/20", "ring-brandblue/20"],
  ["ring-teal-400/15", "ring-brandblue/15"],

  ["border-teal-500/50", "border-brandblue/50"],
  ["border-teal-500/15", "border-brandblue/15"],
  ["border-teal-600/20", "border-navy/25"],
  ["border-teal-500/20", "border-brandblue/20"],
  ["border-teal-400/10", "border-brandblue/10"],
  ["border-teal-400/20", "border-brandblue/20"],
  ["border-teal-400/25", "border-brandblue/25"],

  ["bg-teal-500/[0.12]", "bg-brandblue/15"],
  ["from-teal-500/[0.12]", "from-brandblue/15"],
  ["bg-teal-500/10", "bg-brandblue/10"],
  ["bg-teal-500/15", "bg-brandblue/15"],
  ["bg-teal-500/20", "bg-brandblue/20"],
  ["bg-teal-400/20", "bg-brandblue/20"],
  ["bg-teal-500/5", "bg-brandblue/5"],
  ["dark:bg-teal-500/10", "dark:bg-brandblue/10"],
  ["dark:border-teal-400/20", "dark:border-brandblue/20"],
  ["dark:border-teal-400/25", "dark:border-brandblue/25"],
  ["to-teal-950/40", "to-navy/50"],
  ["dark:from-teal-500/10", "dark:from-brandblue/10"],
  ["dark:bg-teal-500/15", "dark:bg-brandblue/15"],
  ["dark:text-teal-200", "dark:text-brandblue/90"],
  ["dark:text-teal-100", "dark:text-brandblue/90"],
  ["dark:text-teal-300", "dark:text-brandblue"],
  ["dark:text-teal-400", "dark:text-brandblue"],

  ["text-teal-900", "text-navy"],
  ["text-teal-800", "text-navy"],
  ["text-teal-700", "text-navy"],
  ["text-teal-600", "text-brandblue"],
  ["text-teal-500", "text-brandblue"],

  ["bg-teal-950", "bg-navy"],
  ["bg-teal-700", "bg-navy"],
  ["bg-teal-600", "bg-navy"],
  ["bg-teal-500", "bg-brandblue"],

  ["group-hover:text-teal-800", "group-hover:text-navy"],
  ["group-hover:text-teal-700", "group-hover:text-navy"],
  ["group-hover:text-teal-300", "group-hover:text-brandblue"],
  ["group-hover:bg-teal-500/10", "group-hover:bg-brandblue/10"],
  ["group-hover:bg-teal-500/15", "group-hover:bg-brandblue/15"],
  ["decoration-teal-500/40", "decoration-brandblue/40"],

  ["border-l-teal-600", "border-l-brandblue"],
  ["border-t-teal-500", "border-t-brandblue"],
  ["dark:border-l-teal-400", "dark:border-l-brandblue"],
  ["dark:border-t-teal-400", "dark:border-t-brandblue"],

  ["ring-indigo-500/25", "ring-navy/25"],
  ["ring-indigo-500/20", "ring-navy/20"],
  ["ring-indigo-400/25", "ring-navy/30"],
  ["from-indigo-500/[0.12]", "from-navy/15"],
  ["via-indigo-500/[0.04]", "via-navy/5"],
  ["via-indigo-500/[0.06]", "via-navy/8"],
  ["dark:from-indigo-400/[0.14]", "dark:from-brandblue/15"],
  ["dark:via-indigo-500/[0.06]", "dark:via-navy/10"],
  ["bg-indigo-500/12", "bg-navy/12"],
  ["bg-indigo-500/10", "bg-navy/10"],
  ["bg-indigo-500/15", "bg-navy/15"],
  ["bg-indigo-500/20", "bg-navy/20"],
  ["text-indigo-900", "text-navy"],
  ["text-indigo-700", "text-navy"],
  ["text-indigo-400", "text-brandblue"],
  ["ring-indigo-500/20", "ring-navy/20"],
  ["border-indigo-500/20", "border-navy/20"],
  ["from-indigo-500/[0.12]", "from-navy/15"],
  ["group-hover:text-indigo-700", "group-hover:text-navy"],
  ["group-hover:text-indigo-300", "group-hover:text-brandblue"],
  ["hover:bg-indigo-800", "hover:bg-navy/90"],
  ["bg-indigo-700", "bg-navy"],
  ["dark:text-indigo-400", "dark:text-brandblue"],
  ["dark:text-indigo-100", "dark:text-white/90"],

  ["ring-amber-500/25", "ring-gold/40"],
  ["ring-amber-500/15", "ring-gold/25"],
  ["ring-amber-400/15", "ring-gold/25"],
  ["ring-amber-400/30", "ring-gold/35"],
  ["ring-amber-400/20", "ring-gold/25"],
  ["from-amber-500/[0.14]", "from-gold/20"],
  ["via-amber-500/[0.05]", "via-gold/10"],
  ["dark:from-amber-400/[0.12]", "dark:from-gold/15"],
  ["dark:via-amber-500/[0.05]", "dark:via-gold/10"],
  ["bg-amber-500/15", "bg-gold/15"],
  ["bg-amber-500/10", "bg-gold/10"],
  ["bg-amber-500/12", "bg-gold/12"],
  ["bg-amber-500/20", "bg-gold/20"],
  ["text-amber-950", "text-navy"],
  ["text-amber-900", "text-navy"],
  ["text-amber-800", "text-navy"],
  ["text-amber-700", "text-gold"],
  ["text-amber-100", "text-gold"],
  ["border-amber-800/40", "border-navy/30"],
  ["hover:bg-amber-100", "hover:bg-gold/15"],
  ["hover:bg-amber-900", "hover:bg-navy"],
  ["hover:bg-amber-950/70", "hover:bg-navy/80"],
  ["dark:hover:bg-amber-600", "dark:hover:bg-gold/80"],
  ["dark:hover:bg-amber-950/70", "dark:hover:bg-navy/90"],
  ["dark:bg-amber-950/40", "dark:bg-navy/50"],
  ["dark:border-amber-500/40", "dark:border-gold/40"],
  ["dark:text-amber-100", "dark:text-gold"],
  ["bg-amber-800", "bg-navy"],
  ["bg-amber-700", "bg-navy"],
  ["hover:bg-amber-900", "hover:bg-navy/90"],
  ["border-l-amber-500", "border-l-gold"],
  ["border-t-amber-500", "border-t-gold"],
  ["dark:border-l-amber-400", "dark:border-l-gold"],
  ["dark:border-t-amber-400", "dark:border-t-gold"],
  ["group-hover:text-amber-800", "group-hover:text-navy"],
  ["group-hover:text-amber-300", "group-hover:text-gold"],

  ["to-indigo-500/[0.08]", "to-brandblue/10"],
  ["to-indigo-950/40", "to-navy/40"],
  ["dark:to-indigo-950/40", "dark:to-navy/40"],
  ["bg-indigo-400/15", "bg-brandblue/15"],
  ["dark:bg-indigo-500/10", "dark:bg-brandblue/10"],

  ["text-teal-400", "text-brandblue"],
  ["text-teal-300", "text-brandblue"],
];

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, files);
    else if (p.endsWith(".tsx")) files.push(p);
  }
  return files;
}

for (const file of walk(srcRoot)) {
  let c = fs.readFileSync(file, "utf8");
  const orig = c;
  for (const [a, b] of REPLACEMENTS) {
    if (c.includes(a)) c = c.split(a).join(b);
  }
  if (c !== orig) {
    fs.writeFileSync(file, c);
    console.log("updated", path.relative(srcRoot, file));
  }
}
