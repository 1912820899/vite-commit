import { babelParse } from "@vue/compiler-sfc";
import MagicString from "magic-string";

export const rewrite = (source: string) => {
  const ast = babelParse(source, {
    sourceType: "module",
  }).program.body;
  const ms = new MagicString(source);
  ast.forEach((node) => {
    if (node.type === "ImportDeclaration") {
      if (/^[^\.\/]/.test(node.source.value)) {
        ms.overwrite(
          node.source.start!,
          node.source.end!,
          `'/__modules/${node.source.value}';`
        );
      }
    }
    if (node.type === "ExportDefaultDeclaration") {
      ms.overwrite(
        node.start!,
        node.declaration.start!,
        "let __script; export default (__script ="
      );
      ms.appendRight(node.end!, ");");
    }
  });
  return ms.toString();
};
