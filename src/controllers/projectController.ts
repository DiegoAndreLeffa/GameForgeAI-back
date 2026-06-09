import { Request, Response, NextFunction } from 'express';
import { generateGameConfig } from '../services/aiService';
import { Project } from '../models/Project';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  prompt: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
});

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, prompt } = createProjectSchema.parse(req.body);

    const gameConfig = await generateGameConfig(prompt);

    const newProject = await Project.create({
      name,
      originalPrompt: prompt,
      gameConfig,
    });

    res.status(201).json({
      success: true,
      message: 'Projeto gerado com sucesso!',
      data: newProject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    next(error);
  }
};