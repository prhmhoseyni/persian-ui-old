// export function init() {
//   console.log("🔧 Initializing project...");
// }

import chalk from "chalk";
import { exec } from "child_process";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

/**
 * Defines the structure of the .persianuirc.json configuration file.
 */
interface PersianUIConfig {
  tsx: boolean;
  tailwind: {
    version: number;
    css: string;
  };
  aliases: {
    components: string;
  };
}

/**
 * Installs specified npm dependencies.
 * @param dependencies An array of package names to install.
 * @returns A Promise that resolves when dependencies are installed, or rejects on error.
 */
function installDependencies(dependencies: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (dependencies.length === 0) {
      console.log(chalk.gray("No dependencies to install."));
      resolve();
      return;
    }

    const command = `npm install ${dependencies.join(" ")}`;
    const spinner = ora(
      `Installing dependencies: ${chalk.cyan(dependencies.join(", "))}`
    ).start();

    exec(command, (error, stdout, stderr) => {
      if (error) {
        spinner.fail("Failed to install dependencies.");
        console.error(chalk.red(stderr));
        reject(error);
        return;
      }
      spinner.succeed("Dependencies installed successfully.");
      resolve();
    });
  });
}

/**
 * Initializes the Persian UI project by creating a config file and installing core dependencies.
 */
export async function init() {
  console.log(chalk.blue(`Initializing Persian UI project...`));

  try {
    // 1. Create .persianuirc.json file
    const configFileName = ".persianuirc.json";
    const configFilePath = path.join(process.cwd(), configFileName);

    const configContent: PersianUIConfig = {
      tsx: true,
      tailwind: {
        version: 4,
        css: "/src/app/globals.css",
      },
      aliases: {
        components: "/src/components",
      },
    };

    const spinner = ora(
      `Creating ${chalk.cyan(configFileName)} at ${chalk.gray(configFilePath)}...`
    ).start();

    try {
      await fs.writeJson(configFilePath, configContent, { spaces: 2 });
      spinner.succeed(`${configFileName} created successfully.`);
    } catch (error: any) {
      spinner.fail(`Failed to create ${configFileName}.`);
      console.error(chalk.red(error.message));
      throw error; // Re-throw to be caught by the main try/catch
    }

    // 2. Install necessary dependencies (clsx)
    await installDependencies(["clsx"]);

    console.log(
      chalk.bold.green(`\n✨ Persian UI project initialized successfully!`)
    );
  } catch (error) {
    console.error(chalk.red(`\n❌ Failed to initialize Persian UI project.`));
    process.exit(1);
  }
}
