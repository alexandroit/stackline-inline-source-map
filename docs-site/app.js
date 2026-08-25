'use strict';

(() => {
  const defaults = {
    file: 'bundle.js',
    sourceFile: 'src/input.ts',
    sourceRoot: '',
    line: 0,
    column: 0,
    source: [
      'const greeting: string = "Hello, source maps";',
      'console.log(greeting);'
    ].join('\n')
  };

  const elements = {
    file: document.querySelector('#file-name'),
    sourceFile: document.querySelector('#source-file'),
    sourceRoot: document.querySelector('#source-root'),
    line: document.querySelector('#line-offset'),
    column: document.querySelector('#column-offset'),
    source: document.querySelector('#source-input'),
    output: document.querySelector('#result-output'),
    status: document.querySelector('#status-text'),
    indicator: document.querySelector('#status-indicator'),
    lineCount: document.querySelector('#line-count'),
    byteCount: document.querySelector('#byte-count')
  };

  let currentFormat = 'json';
  let currentResult = null;

  document.querySelector('#generate-button').addEventListener('click', generate);
  document.querySelector('#reset-button').addEventListener('click', reset);
  document.querySelector('#copy-output-button').addEventListener('click', () => copyText(elements.output.textContent));
  document.querySelectorAll('[data-output]').forEach((button) => {
    button.addEventListener('click', () => {
      currentFormat = button.dataset.output;
      document.querySelectorAll('[data-output]').forEach((candidate) => {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      });
      render();
    });
  });
  document.querySelectorAll('[data-copy]').forEach((button) => {
    button.addEventListener('click', () => copyText(button.dataset.copy, button));
  });

  reset();

  function reset() {
    elements.file.value = defaults.file;
    elements.sourceFile.value = defaults.sourceFile;
    elements.sourceRoot.value = defaults.sourceRoot;
    elements.line.value = String(defaults.line);
    elements.column.value = String(defaults.column);
    elements.source.value = defaults.source;
    generate();
  }

  function generate() {
    try {
      const source = elements.source.value;
      const offset = {
        line: readNonNegativeInteger(elements.line.value, 'Line offset'),
        column: readNonNegativeInteger(elements.column.value, 'Column offset')
      };
      const generator = globalThis.StacklineInlineSourceMap({
        file: elements.file.value || 'generated.js',
        sourceRoot: elements.sourceRoot.value
      });
      generator
        .addGeneratedMappings(elements.sourceFile.value || 'input.js', source, offset)
        .addSourceContent(elements.sourceFile.value || 'input.js', source);

      currentResult = {
        json: JSON.stringify(generator.toJSON(), null, 2),
        comment: generator.inlineMappingUrl(),
        base64: generator.base64Encode()
      };
      elements.status.textContent = 'Generated successfully';
      elements.indicator.classList.remove('error');
      elements.lineCount.textContent = `${source.split('\n').length} source lines`;
      elements.byteCount.textContent = `${new TextEncoder().encode(currentResult.json).length} map bytes`;
      render();
    } catch (error) {
      currentResult = null;
      elements.output.textContent = error instanceof Error ? error.message : String(error);
      elements.status.textContent = 'Generation failed';
      elements.indicator.classList.add('error');
    }
  }

  function render() {
    if (!currentResult) return;
    elements.output.textContent = currentResult[currentFormat];
  }

  function readNonNegativeInteger(value, label) {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) throw new TypeError(`${label} must be a non-negative integer`);
    return parsed;
  }

  async function copyText(value, button) {
    await navigator.clipboard.writeText(value);
    if (!button) return;
    const previous = button.textContent;
    button.textContent = 'Copied';
    window.setTimeout(() => { button.textContent = previous; }, 1200);
  }
})();
