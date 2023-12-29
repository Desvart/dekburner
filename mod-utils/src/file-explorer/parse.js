import { Collection } from "/mod-utils/src/file-explorer/collection.js";

/**
 * TemplateParse class
 * Parser for a marker based template
 */
export class TemplateParser {
  #html;

  /**
   * @param {NS} ns
   * @param {string} template
   */
  constructor(ns, template) {
    this.#html = ns.read(template);
  }

  /**
   * Parse the template for the given data
   * @param {Collection} data
   * @return {string}
   */
  parse(data) {
    let html = this.#html;

    // Parse all single-valued data items
    let single = data.single;
    for (let placeholder in single) {
      let regex = new RegExp("\\#\\#\\#" + placeholder + "\\#\\#\\#", "g");
      html = html.replace(regex, single[placeholder]).trim();
    }

    // Parse all multi-valued data items
    let multi = data.multi;
    for (let placeholder in multi) {
      // Build a regular expression for the placeholder
      let regex = new RegExp("\\#\\#\\#START LOOP " + placeholder
        + "\\#\\#\\#(.*)\\#\\#\\#END LOOP " + placeholder + "\\#\\#\\#", "s");
      // Get the inner template for the placeholder
      let innerTemplate = html.match(regex)[1];

      // Build the resulting html string
      let htmlResult = "";
      for (let value of multi[placeholder]) {
        let regexInner = new RegExp("\\#\\#\\#" + placeholder + "\\#\\#\\#", "g");
        htmlResult += innerTemplate.replace(regexInner, value).trim();
      }

      // Replace the inner template for the resulting
      // html string in the main html template
      html = html.replace(regex, htmlResult);
    }

    // Return the parsed template
    return html;
  }
}