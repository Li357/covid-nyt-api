// naive memoization for data fetching
export default function memoize<R>(func: () => Promise<R>, maxAge: number): () => Promise<[R, Date]> {
  let lastUpdate: Date | null = null;
  let lastReturnValue: R | null = null;

  return async function memoized(): Promise<[R, Date]> {
    if (!lastUpdate || Date.now() - lastUpdate.getTime() > maxAge) {
      lastReturnValue = await func();
      lastUpdate = new Date();
    }
    return [lastReturnValue!, lastUpdate]; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  };
}
