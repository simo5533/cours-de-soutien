import { mkdir, writeFile, readFile } from "fs/promises";
import path from "path";

const COURSES_DIR = path.join(process.cwd(), "storage", "courses");

export async function ensureCoursesDir() {
  await mkdir(COURSES_DIR, { recursive: true });
}

export function coursePdfPath(fileName: string) {
  return path.join(COURSES_DIR, fileName);
}

export async function saveCoursePdf(courseId: string, data: Buffer) {
  await ensureCoursesDir();
  const fileName = `${courseId}.pdf`;
  const full = path.join(COURSES_DIR, fileName);
  await writeFile(full, data);
  return fileName;
}

export async function readCoursePdfFile(fileName: string) {
  return readFile(coursePdfPath(fileName));
}
