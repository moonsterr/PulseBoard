import React, { useState } from 'react';
import CreateScene from './CreateScene';
import { FaFileCirclePlus, FaArrowRight } from 'react-icons/fa6';
function SceneButton() {
  const [toggle, setToggle] = useState(false);
  const [importToggle, setImportToggle] = useState(false);
  return (
    <>
      <div className="create-scene">
        <button onClick={() => setToggle(true)}>
          <FaFileCirclePlus className="dashboard-icon" /> Create Scene
        </button>
        <button onClick={() => setImportToggle(true)}>
          <FaArrowRight className="dashboard-icon" /> Import Scene{' '}
        </button>
      </div>
      {toggle && <CreateScene setToggle={setToggle} />}
      {importToggle}
    </>
  );
}

export default SceneButton;
