import { z } from 'zod';

// Esquema de validação usando Zod (garante que a IA não invente campos loucos)
export const gameConfigSchema = z.object({
  player: z.object({
    speed: z.number(),
    autoAttack: z.boolean(),
  }),
  enemies: z.object({
    spawnRate: z.number(),
    type: z.enum(['wave', 'continuous', 'boss']),
  }),
  progression: z.object({
    levelUp: z.boolean(),
    skills: z.array(z.string()),
  }),
});

export type GameConfig = z.infer<typeof gameConfigSchema>;