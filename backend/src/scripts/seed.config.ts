export const seedConfig = {
  mode: (process.env.SEED_MODE as 'reset' | 'update') ?? 'reset',
  target: (process.env.SEED_TARGET as 'all' | 'categories' | 'products') ?? 'all',
};
