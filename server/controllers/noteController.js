const mongoose = require('mongoose');
const Note = require('../models/Note');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/notes  -> all notes owned by the logged-in user (private + public)
exports.getMyNotes = async (req, res) => {
  const notes = await Note.find({ owner: req.user._id }).sort({ updatedAt: -1 });
  res.json(notes);
};

// GET /api/notes/public  -> every public note, from any user
exports.getPublicNotes = async (req, res) => {
  const notes = await Note.find({ isPublic: true })
    .sort({ updatedAt: -1 })
    .populate('owner', 'name'); // only expose the author's name
  res.json(notes);
};

// POST /api/notes
exports.createNote = async (req, res) => {
  try {
    const { title, body, isPublic } = req.body;
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: 'Title is required' });
    }
    const note = await Note.create({
      title,
      body,
      isPublic: Boolean(isPublic),
      owner: req.user._id,
    });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/notes/:id  (owner only)
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) return res.status(400).json({ message: 'Invalid note id' });

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    if (!note.owner.equals(req.user._id)) {
      return res.status(403).json({ message: 'You can only edit your own notes' });
    }

    const { title, body, isPublic } = req.body;
    if (title !== undefined) {
      if (!String(title).trim()) return res.status(400).json({ message: 'Title is required' });
      note.title = title;
    }
    if (body !== undefined) note.body = body;
    if (isPublic !== undefined) note.isPublic = Boolean(isPublic);

    await note.save();
    res.json(note);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/notes/:id  (owner only)
exports.deleteNote = async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) return res.status(400).json({ message: 'Invalid note id' });

  const note = await Note.findById(id);
  if (!note) return res.status(404).json({ message: 'Note not found' });
  if (!note.owner.equals(req.user._id)) {
    return res.status(403).json({ message: 'You can only delete your own notes' });
  }

  await note.deleteOne();
  res.json({ message: 'Note deleted' });
};
