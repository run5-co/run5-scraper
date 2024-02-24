import { Miniflare } from "miniflare";

const mf = new Miniflare({
  modules: true,
  scriptPath: "out.js",
  compatibilityDate: "2023-07-01"
});

const res = await mf.dispatchQueue("http://localhost:8787/");
console.log(await res.text()); // Hello Miniflare!
await mf.dispose();