// Export Zod validation schemas and their inferred types.
// Note: generated/types (raw TS interfaces) is intentionally NOT re-exported here
// because it contains duplicate names (e.g. RegisterStudentBody) that conflict with
// the Zod schema exports, causing TS2308 ambiguity errors. Consumers should use
// z.infer<typeof Schema> instead of the raw interfaces.
export * from "./generated/api";
