import React, { useState } from 'react';
import { FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';

function DropdownMenu({ handleDelete, handleUpdate, id }) {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);
  const closeMenu = () => setOpen(false);

  return (
    <div className="dropdown-container" onMouseLeave={closeMenu}>
      <button className="menu-button" onClick={toggleMenu}>
        <FaEllipsisV />
      </button>

      {open && (
        <div className="dropdown-menu">
          <div className="dropdown-item" onClick={() => console.log('Edit')}>
            <FaEdit className="dropdown-icon" />
            <span>Edit Name</span>
          </div>
          <div
            className="dropdown-item delete"
            onClick={() => handleDelete(id)}
          >
            <FaTrash className="dropdown-icon" />
            <span>Delete</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownMenu;
