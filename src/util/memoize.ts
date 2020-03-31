// naive memoization for data fetching
export default function memoize<R>(func: () => Promise<R>, maxAge: number) {
  let lastUpdate: Date = null;
  let lastReturnValue: R = null;

  return async function memoized(): Promise<[R, Date]> {
    if (!lastUpdate || Date.now() - lastUpdate.getTime() > maxAge) {
      lastReturnValue = await func();
      lastUpdate = new Date();
    }
    return [lastReturnValue, lastUpdate];
  };
}
