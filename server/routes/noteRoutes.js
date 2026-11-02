const router = require('express').Router();
const protect = require('../middleware/auth');
const {
  getMyNotes,
  getPublicNotes,
  createNote,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

router.use(protect); // every notes endpoint requires login

router.get('/', getMyNotes);
router.get('/public', getPublicNotes); // declared before '/:id' routes
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
