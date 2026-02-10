import { promises as fs } from "fs";
import * as path from "path";

export async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry: any) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else if (entry.isSymbolicLink()) {
        const link = await fs.readlink(srcPath);
        await fs.symlink(link, destPath);
      } else {
        await fs.copyFile(srcPath, destPath);
      }
    }),
  );
}
