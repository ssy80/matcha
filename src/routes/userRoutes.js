import express from 'express';

//export const router = express.Router();
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Users route' });
});

///api/users/{id}
router.get('/{id}', (req, res) => {
  res.json({ message: 'Users route' });
});

export default router;
//export {router}