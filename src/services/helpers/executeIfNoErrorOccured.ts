export function executeIfNoErrorOccured<T, H>(
  data: T | Error,
  customFunction: (data: T) => H
) {
  if (data instanceof Error) {
    throw data;
  }

  return customFunction(data);
}
