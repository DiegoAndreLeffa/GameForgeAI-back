import mongoose, { Schema, Document } from 'mongoose';
import { GameConfig } from '../types/game.types';

export interface IProject extends Document {
  name: string;
  originalPrompt: string;
  gameConfig: GameConfig;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    originalPrompt: { type: String, required: true },
    gameConfig: {
      player: {
        speed: { type: Number, required: true },
        autoAttack: { type: Boolean, required: true },
      },
      enemies: {
        spawnRate: { type: Number, required: true },
        type: { type: String, enum: ['wave', 'continuous', 'boss'], required: true },
      },
      progression: {
        levelUp: { type: Boolean, required: true },
        skills: [{ type: String }],
      },
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model<IProject>('Project', ProjectSchema);