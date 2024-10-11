#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { spawn } from "child_process";
import https from "https";

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
const version = packageJson.version;

// Function to check for the latest version from npm registry
function checkLatestVersion() {
  const packageName = "fronti"; // Replace with your package name

  const url = `https://registry.npmjs.org/${packageName}/latest`;

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          const latestVersion = JSON.parse(data).version;
          resolve(latestVersion);
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

// Banner
console.log();
console.log(
  "\x1b[38;2;255;0;0m     ███████ ██████   ██████  ███    ██ ████████ ██   \x1b[0m"
);
console.log(
  "\x1b[38;2;255;51;0m     ██      ██   ██ ██    ██ ████   ██    ██    ██   \x1b[0m"
);
console.log(
  "\x1b[38;2;255;102;0m     █████   ██████  ██    ██ ██ ██  ██    ██    ██   \x1b[0m"
);
console.log(
  "\x1b[38;2;255;153;0m     ██      ██   ██ ██    ██ ██  ██ ██    ██    ██   \x1b[0m"
);
console.log(
  "\x1b[38;2;255;204;0m     ██      ██   ██  ██████  ██   ████    ██    ██   \x1b[0m"
);

// Check latest version before displaying the menu
checkLatestVersion()
  .then((latestVersion) => {
    if (version !== latestVersion) {
      console.log(
        `${chalk.yellow("  A new version of Fronti is available!")} ${chalk.red(
          version
        )} → ${chalk.green(latestVersion)}`
      );
      console.log(`  Run ${chalk.cyan(" npm install -g fronti")} to update.\n`);
    } else {
      console.log(
        `${chalk.green(
          "  You are using the latest version of Fronti! (" + version + ")"
        )}\n`
      );
    }

    // Define questions after the version check
    const questions = [
      {
        type: "list",
        name: "framework",
        message: "Which framework would you like to install?",
        choices: [
          { name: chalk.yellow("React"), value: "React" },
          { name: chalk.yellow("Next.js"), value: "Next.js" },
          { name: chalk.yellow("Vue.js"), value: "Vue.js" },
        ],
      },
    ];

    // Show the prompt after the version check
    return inquirer.prompt(questions);
  })
  .then((answers) => {
    const framework = answers.framework;

    let command;
    let args;

    switch (framework) {
      case "React":
        command = "npx";
        args = ["create-react-app", "my-app"];
        break;
      case "Next.js":
        command = "npx";
        args = ["create-next-app", "my-app"];
        break;
      case "Vue.js":
        command = "npm";
        args = ["init", "vue@latest"];
        break;
      default:
        console.log("Invalid selection");
        return; // Exit if an invalid selection is made
    }

    // Execute the installer
    const installer = spawn(command, args, { stdio: "inherit", shell: true });

    installer.on("close", (code) => {
      if (code === 0) {
        console.log(`\x1b[32m${framework} was successfully installed!\x1b[0m`);
      } else {
        console.log(
          `There was an error installing ${framework}. Error code: ${code}`
        );
      }
    });
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
