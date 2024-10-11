#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import { spawn } from "child_process";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("./package.json");

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
console.log(`\nCurrent version: ${chalk.green(version)}\n`); // Display the current package version

// Define questions
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

// Show the prompt
inquirer
  .prompt(questions)
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
