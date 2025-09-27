type Tags = HTMLElementTagNameMap;

function find(tag: string): Element;
function find<T extends keyof Tags>(tag: T): Tags[T];
function find(tag: string, strict: true): Element;
function find(tag: string, strict: false): Element | null;
function find<T extends keyof Tags>(tag: T, strict: true): Tags[T];
function find<T extends keyof Tags>(tag: T, strict: false): Tags[T] | null;
function find(query: string, strict = true) {
  const element = document.querySelector(query);

  if (strict && !element)
    throw new Error(`Can not find "${query}"`);

  return element;
}

export { find };