#!/usr/bin/env node

import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";

const program = new Command();

program
  .name("persian-ui")
  .description("🛠 CLI tool for persian-ui component library")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize the project for persian-ui")
  .action(init);

program
  .command("add")
  .description("Add a new component")
  .argument("<component-name>", "Name of the component to add")
  .action(add);

program.parse();
