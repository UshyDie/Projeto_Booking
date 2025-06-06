import { Router } from 'express';
import UserRoutes from '../domains/users/routes.js';
import PlaceRoutes from '../domains/places/routes.js';

// Importando as rotas dos domínios
// UserRoutes e PlaceRoutes

const router = Router();

router.use('/users', UserRoutes);
router.use('/places', PlaceRoutes);

export default router;
