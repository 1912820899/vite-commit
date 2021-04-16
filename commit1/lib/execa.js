const execa = require("execa");
/* (async () => {
  const { stdout } = await execa("echo", ["hello"]);
})();
 */
// execa("echo", ["hello", "word"]).stdout.pipe(process.stdout);
execa("node", ["test.js"]).then((res) => {
  console.log(res);
  console.log(res.stdout.);
});
