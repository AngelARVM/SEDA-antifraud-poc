export const extractEvent = (msg: any) => msg?.value ?? msg?.event ?? msg;
export const partitionKeyForTx = (transactionId: string) => transactionId;
export function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}
