import fs from "fs";
import { parse, SFCDescriptor } from "@vue/compiler-sfc";
const cache = new Map<string, SFCDescriptor>();

export const parseSFC = (filename: string, isCache = true) => {
  const content = fs.readFileSync(filename, "utf-8");
  const res = parse(content, { filename });
  const { descriptor, errors } = res;
  const preDescriptor = cache.get(filename);
  if (isCache && !errors.length) {
    cache.set(filename, descriptor);
  }
  return { ...res, preDescriptor };
};
