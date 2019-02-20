let awaiter: () => void;

export function setAwaiter(a: () => void) {
  awaiter = a;
}

export function callAwaiter() {
  if (awaiter) {
    awaiter();
  }
}
