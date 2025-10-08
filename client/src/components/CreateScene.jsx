// SceneForm.jsx
import { useState } from 'react';
import createBoardCall from '../utils/createCanvasCall.js';
import { useNavigate } from 'react-router-dom';

export default function CreateScene({ setToggle }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await createBoardCall(name);
      if (res.success) {
        console.log(200);
        navigate(`/canvas?id=${res.data.id}`);
      }
      setToggle(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal-overlay" onClick={() => setToggle(false)}>
      <form
        className="modal-form"
        onClick={(e) => e.stopPropagation()} // 👈 prevents overlay from closing when clicking inside form
        action={handleSubmit}
      >
        <h2>Create a Scene</h2>
        <div className="form-inputs">
          <div className="form-group">
            <label htmlFor="name">Scene Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter scene name"
            />
          </div>
          {/* You can add more inputs here; scroll is handled */}
        </div>
        <button type="submit" className="submit-btn">
          Create
        </button>
      </form>
    </div>
  );
}
