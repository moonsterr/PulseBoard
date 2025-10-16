import {
  authorizeUserService,
  createBoardService,
  getCanvasService,
  getOwnerId,
  getElementsService,
  createCollection,
  getCollectionsByOwner,
  deleteCanvasAndElementsService,
  renameCanvasService,
  renameCollectionService,
  deleteCollectionService,
} from '../services/canvasService.js';

export const createBoard = async (req, res) => {
  try {
    const userId = req.user.id;
    const name = req.body.name;
    const collection = req.body.collection;
    const board = await createBoardService(name, userId, collection);
    if (!board.success) {
      return res.status(401).send({ success: false, data: board.data });
    }
    return res.status(200).send({ success: true, data: board.data });
  } catch (error) {
    console.log('server error', error);
    return { success: false, data: error };
  }
};
export const getCanvases = async (req, res) => {
  try {
    const userId = req.user.id;
    const canvas = await getCanvasService(userId);
    if (!canvas) {
      return res.status(401).send({ success: false, data: canvas.data });
    }
    return res.status(200).send({ success: true, data: canvas.data });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ success: false, data: error });
  }
};
export const authorizeUser = async (req, res) => {
  try {
    const canvasId = req.body.canvasId;
    const userId = req.user.id;

    const ownerObj = await getOwnerId(canvasId);
    if (!ownerObj.success) {
      return res.status(404).send({ success: false, data: ownerObj.data });
    }

    const ownerId = ownerObj.data;
    const authorized = await authorizeUserService(userId, ownerId);

    if (!authorized) {
      return res.status(401).send({ success: false, data: 'not authorized' });
    }

    return res.status(200).send({ success: true, data: 'authorized' });
  } catch (error) {
    console.log(error);
    return res.status(401).send({ success: false, data: error });
  }
};

export async function getElements(req, res) {
  const canvasId = req.params.canvasId;
  try {
    const elements = await getElementsService(canvasId);
    res.send({ success: true, data: elements });
  } catch (err) {
    res
      .status(500)
      .send({ success: false, message: 'Failed to fetch elements' });
  }
}
export const deleteCanvasController = async (req, res) => {
  const canvasId = req.params.id;
  const userId = req.user.id;

  if (!userId || !canvasId) {
    return res
      .status(400)
      .json({ success: false, message: 'Missing userId or canvasId' });
  }

  const result = await deleteCanvasAndElementsService(userId, canvasId);

  if (!result.success) {
    return res.status(403).json(result);
  }

  return res.json(result);
};
export async function handleCreateCollection(req, res) {
  try {
    console.log('hello');
    const { name } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res
        .status(400)
        .send({ success: false, data: 'Collection name is required.' });
    }
    const newCollection = await createCollection(name, ownerId);
    res.status(201).send({ success: true, data: newCollection });
  } catch (err) {
    console.error('Error creating collection:', err);
    res.status(500).send({ success: false, data: err });
  }
}

export async function handleGetCollections(req, res) {
  try {
    const ownerId = req.user.id;
    const collections = await getCollectionsByOwner(ownerId);
    res.status(200).json(collections);
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
export const deleteCollectionController = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const ownerId = req.user.id;

    if (!collectionId)
      return res
        .status(400)
        .json({ success: false, message: 'Collection ID required' });

    const result = await deleteCollectionService(ownerId, collectionId);

    if (!result.success) return res.status(403).json(result);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', data: err });
  }
};

// RENAME CANVAS
export const renameCanvasController = async (req, res) => {
  try {
    const canvasId = req.params.id;
    const ownerId = req.user.id;
    const { newName } = req.body;

    if (!newName)
      return res
        .status(400)
        .json({ success: false, message: 'New name required' });

    const result = await renameCanvasService(canvasId, ownerId, newName);

    if (!result.success) return res.status(403).json(result);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', data: err });
  }
};

// RENAME COLLECTION
export const renameCollectionController = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const ownerId = req.user.id;
    const { newName } = req.body;

    if (!newName)
      return res
        .status(400)
        .json({ success: false, message: 'New name required' });

    const result = await renameCollectionService(
      collectionId,
      ownerId,
      newName
    );

    if (!result.success) return res.status(403).json(result);

    return res.json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: 'Server error', data: err });
  }
};
