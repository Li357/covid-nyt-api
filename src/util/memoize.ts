// naive memoization for data fetching
export default function memoize<R>(func: () => Promise<R>, maxAge: number): () => Promise<R> {
  let lastUpdate: Date | null = null;
  let lastReturnValue: R | null = null;

  return async function memoized(): Promise<R> {
    if (!lastUpdate || Date.now() - lastUpdate.getTime() > maxAge) {
      lastReturnValue = await func();
      lastUpdate = new Date();
    }
    return lastReturnValue!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  };
}
