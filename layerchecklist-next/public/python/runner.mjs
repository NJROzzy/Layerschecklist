// Pinned CPython runtime. Loading is deferred until the learner presses Run.
const INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.8/full/";
let runtime;
self.onmessage = async ({ data: { id, code, input } }) => {
  let python;
  try {
    runtime ??= import(`${INDEX_URL}pyodide.mjs`).then(({ loadPyodide }) => loadPyodide({ indexURL: INDEX_URL }));
    python = await runtime;
  } catch (error) {
    runtime = undefined;
    self.postMessage({ id, type: "load-error", error: String(error) });
    return;
  }
  self.postMessage({ id, type: "ready" });
  let output = "";
  const decoder = new TextDecoder();
  const write = (bytes) => {
    const text = decoder.decode(bytes, { stream: true });
    if (output.length + text.length > 20000) throw new Error("Output limit reached. Try a smaller loop.");
    output += text;
    return bytes.length;
  };
  python.setStdout({ write });
  python.setStderr({ write });
  const answers = input === "" ? [] : input.replace(/\r\n/g, "\n").split("\n");
  python.setStdin({ stdin: () => answers.length ? answers.shift() : undefined });
  const globals = python.runPython("dict(__name__='__main__')");
  try {
    const result = await python.runPythonAsync(code, { globals, filename: "your_program.py" });
    if (result?.destroy) result.destroy();
    self.postMessage({ id, type: "done", output });
  } catch (error) {
    const lines = String(error.message).split("\n");
    const userFrame = lines.findIndex(line => line.includes('File "your_program.py"'));
    // Show the learner's lines first; runtime internals obscure the useful clue.
    const message = (userFrame >= 0 ? lines.slice(userFrame) : lines).join("\n").slice(-5000);
    self.postMessage({ id, type: "python-error", output, error: message });
  } finally {
    globals.destroy();
  }
};
