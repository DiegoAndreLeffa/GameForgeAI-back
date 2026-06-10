import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

import { generateGameConfig } from '../services/aiService';
import { gameConfigSchema } from '../types/game.types';
import { Project } from '../models/Project';

const createProjectSchema = z.object({
  name: z.string().min(1, 'Nome do projeto é obrigatório'),
  prompt: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
});

const updateProjectSchema = z.object({
  name: z.string().optional(),
  gameConfig: gameConfigSchema.optional(),
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

export const getAllProjects = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = updateProjectSchema.parse(req.body);

    const updatedProject = await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedProject) {
      res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Projeto atualizado com sucesso!',
      data: updatedProject,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: error.issues });
      return;
    }
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      res.status(404).json({ success: false, message: 'Projeto não encontrado' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Projeto deletado com sucesso!',
    });
  } catch (error) {
    next(error);
  }
};