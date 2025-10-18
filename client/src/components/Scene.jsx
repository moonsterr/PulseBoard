import React from 'react';
import { FaEdit, FaTrash, FaShareAlt } from 'react-icons/fa'; // icons
import { useNavigate } from 'react-router';
import { handleDelete } from '../utils/deletePost';
import DropdownMenu from './DropdownMenu';
import { useState } from 'react';
import EditName from './EditName';
function Scene({ canvas }) {
  const navigate = useNavigate();
  const [editOpen, setEditOpen] = useState(false);

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
    <>
      {' '}
      {editOpen && (
        <EditName id={canvas.id} name={canvas.name} setToggle={setEditOpen} />
      )}
      <div
        className="scene-container"
        onClick={() => navigate(`/canvas?id=${canvas.id}`)}
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
              {formatMonthsAgo(canvas.created_at)}
            </span>
          </div>

          <div
            className="scene-footer-icons"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <FaEdit className="scene-icon" title="Edit" />
          <FaShareAlt className="scene-icon" title="Share" /> */}
            <DropdownMenu
              title="Delete"
              handleDelete={handleDeleteCanvas}
              setEditOpen={setEditOpen}
              id={canvas.id}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Scene;
