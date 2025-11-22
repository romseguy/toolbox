export const getRefId = (entity?: Record<string, any> | null, key?: string) => {
  if (!entity) return "";
  const value = entity[key || "createdBy"];

  if (typeof value === "object") return value?._id;

  return value;
};
