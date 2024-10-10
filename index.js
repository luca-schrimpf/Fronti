import inquirer from "inquirer";
import chalk from "chalk";
import { spawn } from "child_process";

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
console.log();

// Fragen definieren
const questions = [
  {
    type: "list",
    name: "framework",
    message: "Welches Framework möchtest du installieren?",
    choices: [
      { name: chalk.yellow("React"), value: "React" },
      { name: chalk.yellow("Next.js"), value: "Next.js" },
      { name: chalk.yellow("Vue.js"), value: "Vue.js" },
    ],
  },
];

// Prompt anzeigen
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
        console.log("Ungültige Auswahl");
        return; // Abbrechen, wenn keine gültige Auswahl getroffen wurde
    }

    // Installer ausführen
    const installer = spawn(command, args, { stdio: "inherit", shell: true });

    installer.on("close", (code) => {
      if (code === 0) {
        console.log(
          `\x1b[32m${framework} wurde erfolgreich installiert!\x1b[0m`
        );
      } else {
        console.log(
          `Es gab einen Fehler bei der Installation von ${framework}. Fehlercode: ${code}`
        );
      }
    });
  })
  .catch((error) => {
    console.error("Ein Fehler ist aufgetreten:", error);
  });
