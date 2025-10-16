import query from './dbQuery.js';

export const createBoardService = async (name, owner, collection) => {
  console.log('is it reach');
  try {
    const text = `
    INSERT INTO canvases (name, owner_id, belongs_to_collection)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
    const values = [name, owner, collection];
    console.log(values);

    const result = await query(text, values);
    return { success: true, data: result.rows[0] }; // the new board
  } catch (error) {
    console.log(error);
    return { success: false, data: error };
  }
};
export const getCanvasService = async (userId) => {
  try {
    const text = `
      SELECT DISTINCT c.id, c.name, c.created_at, u.username AS owner_name,  c.belongs_to_collection AS collection_id
      FROM canvases c
      JOIN users u ON c.owner_id = u.id
      WHERE c.owner_id = $1
         OR c.owner_id IN (
           SELECT authorized_by
           FROM authorized
           WHERE user_id = $1
         )
      ORDER BY c.created_at DESC;
    `;
    const values = [userId];

    const result = await query(text, values);

    return { success: true, data: result.rows };
  } catch (error) {
    console.log(error);
    return { success: false, data: error };
  }
};
export const authorizeUserService = async (userId, ownerId) => {
  try {
    // Case 1: User is the direct owner
    if (userId === ownerId) {
      return true;
    }

    // Case 2: Check if the user is authorized by the owner

    const result = await query(
      `SELECT 1 
       FROM authorized 
       WHERE user_id = $1 AND authorized_by = $2
       LIMIT 1;`,
      [userId, ownerId]
    );
    return result.rowCount > 0; // true if authorized exists
  } catch (err) {
    console.error('Error in authorizeUserService:', err);
    return false; // safer fallback
  }
};

export const getOwnerId = async (canvasId) => {
  try {
    const text = `
      SELECT owner_id
      FROM canvases
      WHERE id = $1;
    `;
    const values = [canvasId];

    const result = await query(text, values);

    if (result.rows.length === 0) {
      return { success: false, data: 'Canvas not found' };
    }

    return { success: true, data: result.rows[0].owner_id };
  } catch (error) {
    console.log(error);
    return { success: false, data: error };
  }
};
export const deleteCanvasService = async (canvasId) => {
  try {
    const text = `DELETE FROM canvases WHERE id = $1 RETURNING *;`;
    const values = [canvasId];
    const result = await query(text, values);

    if (result.rows.length === 0) {
      return { success: false, data: 'Canvas not found' };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('Error deleting canvas:', error);
    return { success: false, data: error };
  }
};
export const saveElement = async (element, canvasId) => {
  try {
    const text = `
      INSERT INTO elements 
      (special_id, canvas_id, type, starting_position, ending_position, text_content, style, points)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const values = [
      element._id,
      canvasId,
      element.type,
      element.startingPosition
        ? JSON.stringify(element.startingPosition)
        : null,
      element.endingPosition ? JSON.stringify(element.endingPosition) : null,
      element.text ?? null,
      element.style ? JSON.stringify(element.style) : null,
      element.points ? JSON.stringify(element.points) : null,
    ];

    const result = await query(text, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error saving element:', error);
    return null;
  }
};

// Update an existing element in a canvas
export const updateElement = async (element, canvasId) => {
  try {
    const text = `
      UPDATE elements SET 
        ending_position = $1,
        points = $2,
        style = $3,
        updated_at = now(),
        version = version + 1
      WHERE special_id = $4 AND canvas_id = $5
      RETURNING *;
    `;
    const values = [
      element.endingPosition ? JSON.stringify(element.endingPosition) : null,
      element.points ? JSON.stringify(element.points) : null,
      element.style ? JSON.stringify(element.style) : null,
      element._id,
      canvasId,
    ];

    const result = await query(text, values);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating element:', error);
    return null;
  }
};
export async function getElementsService(canvasId) {
  try {
    console.log(canvasId, 2312321);
    const res = await query(
      'SELECT * FROM elements WHERE canvas_id = $1 ORDER BY id ASC',
      [canvasId]
    );

    const formatted = res.rows.map((el) => {
      const base = {
        _id: el.special_id || el.id.toString(), // frontend uses _id
        type: el.type,
        style: el.style,
      };

      if (['draw', 'eraser'].includes(el.type)) {
        base.points = el.points || [];
      } else {
        base.startingPosition = el.starting_position;
        base.endingPosition = el.ending_position;
        base.text_content = el.text_content;
      }

      return base;
    });

    return formatted;
  } catch (err) {
    console.error('Error fetching elements:', err);
    throw err;
  }
}
export const deleteCanvasAndElementsService = async (userId, canvasId) => {
  try {
    // Step 1: Check if the user owns the canvas
    const ownerRes = await query(
      `SELECT owner_id FROM canvases WHERE id = $1`,
      [canvasId]
    );

    if (ownerRes.rows.length === 0) {
      return { success: false, message: 'Canvas not found' };
    }

    if (ownerRes.rows[0].owner_id !== userId) {
      return {
        success: false,
        message: 'Not authorized to delete this canvas',
      };
    }

    // Step 2: Delete elements linked to the canvas
    await query(`DELETE FROM elements WHERE canvas_id = $1`, [canvasId]);

    // Step 3: Delete the canvas itself
    const canvasRes = await query(
      `DELETE FROM canvases WHERE id = $1 RETURNING *`,
      [canvasId]
    );

    return { success: true, data: canvasRes.rows[0] };
  } catch (error) {
    console.error('Error deleting canvas and elements:', error);
    return { success: false, message: 'Server error' };
  }
};

export async function createCollection(name, ownerId) {
  const result = await query(
    'INSERT INTO collections (name, owner_id) VALUES ($1, $2) RETURNING *;',
    [name, ownerId]
  );
  console.log(result.rows);
  return result.rows[0];
}

export async function getCollectionsByOwner(ownerId) {
  const result = await query(
    'SELECT * FROM collections WHERE owner_id = $1 ORDER BY id;',
    [ownerId]
  );
  return result.rows;
}
export const renameCanvasService = async (canvasId, ownerId, newName) => {
  try {
    // Check ownership
    const res = await query(`SELECT owner_id FROM canvases WHERE id = $1`, [
      canvasId,
    ]);

    if (res.rows.length === 0)
      return { success: false, message: 'Canvas not found' };
    if (res.rows[0].owner_id !== ownerId)
      return { success: false, message: 'Not authorized' };

    // Update
    const updateRes = await query(
      `UPDATE canvases SET name = $1 WHERE id = $2 RETURNING *`,
      [newName, canvasId]
    );

    return { success: true, data: updateRes.rows[0] };
  } catch (err) {
    console.error('Error renaming canvas:', err);
    return { success: false, message: 'Server error', data: err };
  }
};

// Rename collection
export const renameCollectionService = async (
  collectionId,
  ownerId,
  newName
) => {
  try {
    // Check ownership
    const res = await query(`SELECT owner_id FROM collections WHERE id = $1`, [
      collectionId,
    ]);

    if (res.rows.length === 0)
      return { success: false, message: 'Collection not found' };
    if (res.rows[0].owner_id !== ownerId)
      return { success: false, message: 'Not authorized' };

    // Update
    const updateRes = await query(
      `UPDATE collections SET name = $1 WHERE id = $2 RETURNING *`,
      [newName, collectionId]
    );

    return { success: true, data: updateRes.rows[0] };
  } catch (err) {
    console.error('Error renaming collection:', err);
    return { success: false, message: 'Server error', data: err };
  }
};
export const deleteCollectionService = async (ownerId, collectionId) => {
  try {
    // Step 1: Check ownership
    const res = await query(`SELECT owner_id FROM collections WHERE id = $1`, [
      collectionId,
    ]);

    if (res.rows.length === 0) {
      return { success: false, message: 'Collection not found' };
    }

    if (res.rows[0].owner_id !== ownerId) {
      return {
        success: false,
        message: 'Not authorized to delete this collection',
      };
    }

    // Step 2: Get all canvases in this collection
    const canvasesRes = await query(
      `SELECT id FROM canvases WHERE belongs_to_collection = $1`,
      [collectionId]
    );

    const canvasIds = canvasesRes.rows.map((row) => row.id);

    // Step 3: Delete elements in those canvases
    if (canvasIds.length > 0) {
      await query(`DELETE FROM elements WHERE canvas_id = ANY($1::int[])`, [
        canvasIds,
      ]);

      // Delete the canvases
      await query(`DELETE FROM canvases WHERE id = ANY($1::int[])`, [
        canvasIds,
      ]);
    }

    // Step 4: Delete the collection itself
    await query(`DELETE FROM collections WHERE id = $1`, [collectionId]);

    return { success: true, message: 'Collection and its canvases deleted' };
  } catch (error) {
    console.error('Error deleting collection and canvases:', error);
    return { success: false, message: 'Server error', data: error };
  }
};
