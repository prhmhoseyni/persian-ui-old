import chalk from "chalk";
import fetch from "node-fetch";
import { exec } from "child_process";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

interface ComponentsData {
  [key: string]: {
    dependencies: string[] | null;
    src: string;
  };
}

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
        console.error(stderr);
        reject(error);
        return;
      }
      spinner.succeed("Dependencies installed successfully.");
      resolve();
    });
  });
}

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

export async function add(componentName: string) {
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

  console.log(chalk.blue(`Adding component: ${chalk.bold(componentName)}`));

  try {
    // 3. Install dependencies
    await installDependencies(component.dependencies);

    // 4. Fetch component folder from GitHub
    const rootDir = process.cwd();
    const destination = path.join(rootDir, "src", "components", componentName);
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
