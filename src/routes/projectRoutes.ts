import { Router } from 'express';
import { 
  createProject, 
  getAllProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';

const router = Router();

// Rota: POST /api/projects (Criar via IA)
router.post('/', createProject);

// Rota: GET /api/projects (Listar todos)
router.get('/', getAllProjects);

// Rota: GET /api/projects/:id (Buscar único)
router.get('/:id', getProjectById);

// Rota: PUT /api/projects/:id (Atualizar manualmente pelo Editor)
router.put('/:id', updateProject);

// Rota: DELETE /api/projects/:id (Deletar projeto)
router.delete('/:id', deleteProject);

export default router;