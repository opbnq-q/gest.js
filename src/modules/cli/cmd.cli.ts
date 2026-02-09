import { Command } from "commander";
import { VERSION } from "../../config/consts";
import { Templates } from "../templates/index.templates";
import { ETemplates } from "../templates/enum.templates";

export class CMD {
  private static instance: CMD;
  private readonly program!: Command;
  private readonly templates!: Templates;

  private constructor() {
    this.program = new Command();
    this.templates = new Templates();
  }

  public static create() {
    if (CMD.instance) {
      return CMD.instance;
    }
    const instance = new CMD();
    CMD.instance = instance;
    return instance;
  }

  private build() {
    this.program
      .name("gest.js CLI")
      .description(
        "A CLI for gest.js, an ultimate backend framework for Node.js",
      )
      .version(VERSION, "-v, --version", "output the current version")
      .option("-n, --new <destination>", "create a new project", ".")
      .action((options, cmd) => {
        if (options.version) {
          console.log(`gest.js CLI version: ${VERSION}`);
        }
        if (options.new) {
          console.log("Creating a new gest.js project...");
          this.templates.copy(ETemplates.INIT, options.new);
          console.log("Done.");
        }
      });
  }

  async initialize() {
    this.build();
    this.program.parse();
  }
}
