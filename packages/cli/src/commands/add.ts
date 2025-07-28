import chalk from "chalk";
import fetch from "node-fetch";
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
 * Defines the structure of component data fetched from the registry.
 */
interface ComponentsData {
  [key: string]: {
    dependencies: string[] | null;
    src: string;
  };
}

/**
 * Loads the component registry data from a remote GitHub URL.
 * @returns A Promise that resolves with the ComponentsData, or rejects on error.
 */
async function getComponentData(): Promise<ComponentsData> {
  const registryURL =
    "https://raw.githubusercontent.com/prhmhoseyni/persian-ui/refs/heads/main/packages/cli/libs/components.json";
  const spinner = ora(
    `Loading component registry from ${chalk.cyan(registryURL)}...`
  ).start();

  try {
    const response = await fetch(registryURL);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch component registry: ${response.statusText} (${response.status})`
      );
    }

    const componentData = (await response.json()) as ComponentsData;
    spinner.succeed("Component registry loaded successfully.");
    return componentData;
  } catch (error: any) {
    spinner.fail("Failed to load component registry.");
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Reads the .persianuirc.json configuration file from the project root.
 * @returns A Promise that resolves with the PersianUIConfig, or rejects if the file is not found or invalid.
 */
async function getPersianUIConfig(): Promise<PersianUIConfig> {
  const configFileName = ".persianuirc.json";
  const configFilePath = path.join(process.cwd(), configFileName);
  const spinner = ora(`Reading ${chalk.cyan(configFileName)}...`).start();

  try {
    if (!fs.existsSync(configFilePath)) {
      spinner.fail(`${configFileName} not found.`);
      throw new Error(
        `Configuration file "${configFileName}" not found. Please run "persian-ui init" first.`
      );
    }
    const config = (await fs.readJson(configFilePath)) as PersianUIConfig;
    spinner.succeed(`${configFileName} loaded successfully.`);
    return config;
  } catch (error: any) {
    spinner.fail(`Failed to read ${configFileName}.`);
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

/**
 * Installs specified npm dependencies.
 * @param dependencies An array of package names to install.
 * @returns A Promise that resolves when dependencies are installed, or rejects on error.
 */
function installDependencies(dependencies: string[] | null): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!dependencies || dependencies.length === 0) {
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
 * Fetches a component directory from a GitHub repository.
 * @param repoURL The URL to the component directory on GitHub (e.g., raw.githubusercontent.com link).
 * @param destination The local path where the component files should be saved.
 * @returns A Promise that resolves when the component is fetched, or rejects on error.
 */
async function fetchComponentFromGitHub(
  repoURL: string,
  destination: string
): Promise<void> {
  const spinner = ora(
    `Fetching component from ${chalk.cyan(repoURL)}...`
  ).start();
  try {
    const parts = repoURL.split("/");
    const owner = parts[3];
    const repo = parts[4];
    const branch = parts[6];
    const repoPath = parts.slice(7).join("/");

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${repoPath}?ref=${branch}`;

    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch directory info: ${response.statusText}`);
    }
    const files = (await response.json()) as any[];

    if (!Array.isArray(files)) {
      throw new Error(
        "The specified path is not a directory or the repository is private."
      );
    }

    await fs.ensureDir(destination);

    for (const file of files) {
      if (file.type === "file" && file.download_url) {
        const fileResponse = await fetch(file.download_url);
        if (!fileResponse.ok) {
          spinner.warn(`Could not fetch file: ${file.name}`);
          continue;
        }
        const fileContent = await fileResponse.buffer();
        await fs.writeFile(path.join(destination, file.name), fileContent);
      }
    }
    spinner.succeed(
      `Component successfully fetched and placed in ${chalk.green(destination)}.`
    );
  } catch (error: any) {
    spinner.fail("Failed to fetch component from GitHub.");
    console.error(chalk.red(error.message));
    throw error;
  }
}

/**
 * Adds a specified component to the project.
 * @param componentName The name of the component to add.
 */
export async function add(componentName: string) {
  console.log(chalk.blue(`Adding component: ${chalk.bold(componentName)}`));

  try {
    // 1. Load data asynchronously from the remote source
    const componentData = await getComponentData();

    // 2. Validate component name
    const component = componentData[componentName];

    if (!component) {
      console.error(chalk.red(`Error: Component "${componentName}" not found.`));
      console.log(
        chalk.yellow("Available components:"),
        Object.keys(componentData).join(", ")
      );
      process.exit(1);
    }

    // 3. Load project configuration from .persianuirc.json
    const config = await getPersianUIConfig();
    const componentsAlias = config.aliases.components;

    if (!componentsAlias) {
      console.error(
        chalk.red(
          `Error: 'aliases.components' not found in .persianuirc.json. Please check your configuration.`
        )
      );
      process.exit(1);
    }

    // 4. Install dependencies
    await installDependencies(component.dependencies);

    // 5. Fetch component folder from GitHub
    const rootDir = process.cwd();
    // Use the components alias from the config file
    const destination = path.join(rootDir, componentsAlias, componentName);
    await fetchComponentFromGitHub(component.src, destination);

    console.log(
      chalk.bold.green(`\n🚀 Component "${componentName}" added successfully!`)
    );
  } catch (error) {
    console.error(
      chalk.red(`\n❌ Failed to add component "${componentName}".`)
    );
    process.exit(1);
  }
}
