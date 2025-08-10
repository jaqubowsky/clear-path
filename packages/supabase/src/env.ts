import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(10),
});

export type BrowserEnv = z.infer<typeof envSchema>;

export function validateEnv(
  env: Partial<NodeJS.ProcessEnv>,
): BrowserEnv {
  const parsed = envSchema.safeParse(env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join(", ");
    throw new Error(`Invalid Supabase browser env: ${issues}`);
  }
  return parsed.data;
}

declare global {
  // Augment process.env for DX while developing in this monorepo
  // Consumers should not rely on this type directly
  namespace NodeJS {
    interface ProcessEnv extends BrowserEnv {}
  }
}
