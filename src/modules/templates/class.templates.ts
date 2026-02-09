import { copyDir } from "../../utils/copy-dir.util";
import { ETemplates } from "./enum.templates";
import { join, resolve } from "path";

export class Templates {
  private readonly templatesPath = join(__dirname, "..", "..", "templates");

  getPath(template: ETemplates) {
    const path = resolve(this.templatesPath, template);
    return path;
  }

  copy(template: ETemplates, destination: string) {
    const path = this.getPath(template);
    const resolvedDestination = resolve(destination);
    copyDir(path, resolvedDestination);
  }
}
