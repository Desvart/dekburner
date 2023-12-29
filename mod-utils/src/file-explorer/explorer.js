import { TemplateParser } from "/mod-utils/src/file-explorer/parse.js";
import { Collection } from "/mod-utils/src/file-explorer/collection.js"

/** @param {NS} ns **/
export async function main(ns) {
  var doc = eval("document");

  let template = "./explorer.html.txt";
  var parser = new TemplateParser(ns, template);
  var fileStructure = {
    dirs: {},
    files: []
  };
  let files = ns.ls("home");

  for (let file of files) {
    let filePath = file.split("/");
    let struct = fileStructure;
    while (filePath.length > 0) {
      let part = filePath.shift();
      if (part !== "") {
        if (filePath.length > 0) {
          if (struct.dirs[part] === undefined) {
            struct.dirs[part] = {
              dirs: {},
              files: []
            };
          }
          struct = struct.dirs[part];
        } else {
          struct.files.push(part);
        }
      }
    }
  }

  ns.alert("<div id='explorer-window' class='explorer-window'></div>");

  var explorerWindow = doc.getElementById("explorer-window");

  var currentPath = [];
  var selectedFiles = [];

  function runCommandInTerminal(command) {
    // Get the terminal input field from the DOM
    const terminal = doc.getElementById("terminal-input");

    // Print the command to the terminal input field
    terminal.value = command;

    // Get a reference to the React event handler.
    const handler = Object.keys(terminal)[1];

    // Perform an onChange event to set some internal values.
    terminal[handler].onChange({ target: terminal });

    // Simulate an enter press
    terminal[handler].onKeyDown({ keyCode: 13, preventDefault: () => null });
  }

  function openFiles() {
    let command = "nano";
    for (let file of selectedFiles.values()) {
      command += " " + file;
    }
    runCommandInTerminal(command);
  }

  async function removeFiles() {
    let command = "";
    for (let file of selectedFiles) {
      command += "rm " + file + ";";
    }
    runCommandInTerminal(command);
  }

  function toggleSelected(file) {
    if (currentPath.length > 0) {
      file = "/" + currentPath.join("/") + "/" + file;
    } else {
      file = "/" + file;
    }
    if (selectedFiles.includes(file)) {
      selectedFiles.splice(
        selectedFiles.indexOf(file), 1
      );
    } else {
      selectedFiles.push(file);
    }
  }

  function update() {
    // Make a new data collection for template parsing
    let data = new Collection();

    // Find the currently selected folder
    let struct = fileStructure;
    for (let part of currentPath) {
      struct = struct.dirs[part];
    }

    // Add data for parsing to collection
    data.add("FILE", struct.files);
    data.add("DIR", Object.keys(struct.dirs));
    let currentPathText = "/<span class='explorer-back-link' data-target='0'>"
      + "root</span>/";
    for (let index in currentPath) {
      currentPathText +=
        "<span class='explorer-back-link' data-target='"
        + (parseInt(index) + 1) + "'>"
        + currentPath[index] + "</span>/";
    }
    data.add("PATH", currentPathText);
    let selectedFilesText = "";
    if (selectedFiles.length > 0) {
      selectedFilesText = "[" + selectedFiles.join(", ") + "]";
    }
    data.add("FILES SELECTED", selectedFilesText);

    // Parse the template html
    let html = "Something went wrong!";
    try {
      html = parser.parse(data);
    } catch (e) {
      console.log(e);
    }

    // Update the explorer window inner html
    explorerWindow.innerHTML = html;

    // Make new listeners
    let dirs = doc.getElementsByClassName("explorer-directory");
    for (let dir of dirs) {
      dir.addEventListener('dblclick', function (e) {
        selectedFiles = [];
        currentPath.push(dir.id);
        update();
      });
    }

    let selectedFilesTextDiv = doc.getElementById("explorer-files-selected");
    let files = doc.getElementsByClassName("explorer-file");
    for (let file of files) {
      file.addEventListener('click', function (e) {
        file.classList.toggle("selected");
        toggleSelected(file.id);

        let selectedFilesText = "";
        if (selectedFiles.length > 0) {
          selectedFilesText = "[" + selectedFiles.join(", ") + "]";
        }
        selectedFilesTextDiv.innerHTML = selectedFilesText;
      });
    }

    let backLinks = doc.getElementsByClassName("explorer-back-link");
    for (let backLink of backLinks) {
      backLink.addEventListener('click', function (e) {
        currentPath.splice(backLink.dataset.target, currentPath.length);
        update();
      });
    }

    doc.getElementById("explorer-remove").addEventListener('click', function (e) {
      removeFiles();
    });
    doc.getElementById("explorer-open").addEventListener('click', function (e) {
      openFiles();
    });
  }

  update();
}