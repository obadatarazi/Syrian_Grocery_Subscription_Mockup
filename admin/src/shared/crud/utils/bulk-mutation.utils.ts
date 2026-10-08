export type CrudBulkMutationResult = {
  succeededIds: Array<string | number>;
  failedIds: Array<string | number>;
  errors: Array<{ id: string | number; error: Error }>;
};

export function createEmptyBulkMutationResult(): CrudBulkMutationResult {
  return {
    succeededIds: [],
    failedIds: [],
    errors: [],
  };
}

export function collectSettledBulkResults<TId extends string | number>(
  ids: TId[],
  settled: PromiseSettledResult<unknown>[],
): CrudBulkMutationResult {
  const result = createEmptyBulkMutationResult();

  settled.forEach((entry, index) => {
    const id = ids[index];
    if (entry.status === "fulfilled") {
      result.succeededIds.push(id);
      return;
    }

    const error =
      entry.reason instanceof Error ? entry.reason : new Error(String(entry.reason ?? "Request failed"));
    result.failedIds.push(id);
    result.errors.push({ id, error });
  });

  return result;
}
