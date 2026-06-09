import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { gameConfigSchema, GameConfig } from '../types/game.types';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export const generateGameConfig = async (prompt: string): Promise<GameConfig> => {
  const systemInstruction = `
    Você é um Game Designer Especialista IA do GameForge AI.
    Sua missão é converter a descrição de um jogo em um arquivo de configuração JSON estruturado.
    
    Regras obrigatórias:
    1. Retorne APENAS um JSON válido. Nenhuma palavra antes ou depois.
    2. O JSON deve seguir EXATAMENTE a seguinte estrutura:
    {
      "player": { "speed": number, "autoAttack": boolean },
      "enemies": { "spawnRate": number, "type": "wave" | "continuous" | "boss" },
      "progression": { "levelUp": boolean, "skills": string[] }
    }
    
    Exemplo: Se o usuário pedir um jogo tipo Vampire Survivors lento, autoAttack é true e speed é baixo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `${systemInstruction}\n\nPedido do usuário: ${prompt}`,
    });

    const responseText = response.text;
    if (!responseText) {
      console.error('Gemini retornou resposta sem texto:', response);
      throw new Error('A IA não retornou texto para parser.');
    }

    const rawJson = JSON.parse(responseText);

    const validatedConfig = gameConfigSchema.parse(rawJson);

    return validatedConfig;
  } catch (error) {
    console.error('Erro no aiService:', error);
    throw new Error('Falha ao gerar a configuração do jogo via IA. O formato pode ter vindo inválido.');
  }
};