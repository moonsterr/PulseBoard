import query from './dbQuery.js';

export const createBoardService = async (name, owner) => {
  console.log('is it reach');
  try {
    const text = `
    INSERT INTO canvases (name, owner_id)
    VALUES ($1, $2)
    RETURNING *;
  `;
    const values = [name, owner];
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
      SELECT DISTINCT c.id, c.name, c.created_at, u.username AS owner_name
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
