import React from 'react';
import { FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa'; // icons
import { useNavigate } from 'react-router';
import { handleDelete } from '../utils/deletePost';

function Scene({ canvas }) {
  const navigate = useNavigate();
  function formatMonthsAgo(createdAt) {
    if (!createdAt) return 'Unknown time';

    const createdDate = new Date(createdAt);
    const now = new Date();

    const yearsDiff = now.getFullYear() - createdDate.getFullYear();
    const monthsDiff = now.getMonth() - createdDate.getMonth();

    const totalMonths = yearsDiff * 12 + monthsDiff;

    if (totalMonths <= 0) return 'This month';
    if (totalMonths === 1) return '1 month ago';
    return `${totalMonths} months ago`;
  }
  async function handleDeleteCanvas(id) {
    await handleDelete(id);
  }
  return (
    <div
      className="scene-container"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/canvas?id=${canvas.id}`);
      }}
    >
      <div className="scene-img">
        {/* {canvas.image ? (
          <img src={canvas.image} alt={canvas.title} />
        ) : (
          <div className="placeholder-img">No image</div>
        )} */}
      </div>

      <div className="scene-footer">
        <div className="scene-footer-text">
          <h3>{canvas.name || 'Untitled'}</h3>
          <p>by {canvas.owner_name || 'Unknown'}</p>
          <span className="scene-time">
            {' '}
            {formatMonthsAgo(canvas.created_at)}
          </span>
        </div>

        <div
          className="scene-footer-icons"
          onClick={() => handleDeleteCanvas(canvas.id)}
        >
          {/* <FaEdit className="scene-icon" title="Edit" />
          <FaShareAlt className="scene-icon" title="Share" /> */}
          <FaTrash className="scene-icon" title="Delete" />
        </div>
      </div>
    </div>
  );
}

export default Scene;
