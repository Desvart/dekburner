/** @param {NS} ns **/
export async function main(ns) {
  // Get a reference to the document
  let doc = eval("document");

  // Build the css
  let css = "";

  for (let cssFile of ns.ls("home", ".css.txt")) {
    css += ns.read(cssFile);
  }

  // Add the css to the game
  let styleDiv = doc.getElementById('myCustomStyles');
  if (!styleDiv) {
    // Make a new new div
    styleDiv = doc.createElement("div");
    styleDiv.id = 'myCustomStyles';
    doc.getElementsByTagName('head')[0].appendChild(styleDiv);
  }
  styleDiv.innerHTML = "<style>" + css + "</style>";
}