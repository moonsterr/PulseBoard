import {
  authorizeUserService,
  createBoardService,
  getCanvasService,
  getOwnerId,
  deleteCanvasService,
  getElementsService,
} from '../services/canvasService.js';

export const createBoard = async (req, res) => {
  try {
    const userId = req.user.id;
    const name = req.body.name;
    const board = await createBoardService(name, userId);
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
export const deleteCanvas = async (req, res) => {
  try {
    const canvasId = req.params.id;
    const userId = req.user.id;

    // Get owner of the canvas
    const ownerObj = await getOwnerId(canvasId);
    if (!ownerObj.success) {
      return res.status(404).send({ success: false, data: ownerObj.data });
    }

    const ownerId = ownerObj.data;

    // Check authorization (owner or authorized user)
    const authorized = await authorizeUserService(userId, ownerId);
    if (!authorized) {
      return res
        .status(401)
        .send({ success: false, data: 'Not authorized to delete this canvas' });
    }

    // Delete the canvas
    const deleted = await deleteCanvasService(canvasId);
    if (!deleted.success) {
      return res.status(404).send({ success: false, data: deleted.data });
    }

    return res.status(200).send({ success: true, data: deleted.data });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ success: false, data: error });
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
