// SceneForm.jsx
import { useState } from 'react';
import createBoardCall from '../utils/createCanvasCall.js';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

export default function CreateScene({ setToggle }) {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { setData } = useOutletContext();
  const location = useLocation();
  const lastSegment = location.pathname.split('/').filter(Boolean).pop();

  const handleSubmit = async () => {
    try {
      console.log(lastSegment);
      const res = await createBoardCall(name, lastSegment);

      if (res.success) {
        setData((prev) => [...prev, res.data]);
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
