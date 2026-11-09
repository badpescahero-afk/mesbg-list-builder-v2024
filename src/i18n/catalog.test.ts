import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { expect, it } from "vitest";
import { spanish } from "./spanish";

// Source-level coverage complements the browser flows: each explicitly marked
// UI message must exist in the catalog. Dynamic game values are excluded.
it("has a Spanish entry for every static message used by the interface", () => {
  const missing: string[] = [];
  let checked = 0;
  function walk(directory: string) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(file);
        continue;
      }
      if (!file.endsWith(".tsx")) continue;
      const source = ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const check = (message: string) => {
        checked++;
        if (!Object.prototype.hasOwnProperty.call(spanish, message))
          missing.push(`${file}: ${message}`);
      };
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isIdentifier(node.expression) &&
          ["t", "translateUI"].includes(node.expression.text)
        ) {
          const argument = node.arguments[0];
          if (argument && ts.isStringLiteral(argument)) check(argument.text);
        }
        if (
          (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) &&
          node.tagName.getText(source) === "TranslatedText"
        ) {
          for (const attribute of node.attributes.properties) {
            if (
              !ts.isJsxAttribute(attribute) ||
              attribute.name.getText(source) !== "message"
            )
              continue;
            const value = attribute.initializer;
            if (value && ts.isStringLiteral(value)) check(value.text);
            else if (
              value &&
              ts.isJsxExpression(value) &&
              value.expression &&
              ts.isStringLiteral(value.expression)
            )
              check(value.expression.text);
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(source);
    }
  }
  walk("src");
  expect(checked).toBeGreaterThan(500);
  expect(missing).toEqual([]);
});
