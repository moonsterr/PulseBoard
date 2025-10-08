import {
  FaLock,
  FaHandPaper,
  FaMousePointer,
  FaSquare,
  FaGem,
  FaCircle,
  FaArrowRight,
  FaMinus,
  FaPencilAlt,
  FaFont,
  FaRegImage,
  FaEraser,
  FaShapes,
} from 'react-icons/fa';
import { DrawContext } from '../pages/CanvasInstance';
import { useContext } from 'react';

export default function DrawOptions() {
  const { draw, setDraw } = useContext(DrawContext);

  const setCurrentTool = (tool) => {
    setDraw((prev) => ({
      ...prev,
      current: tool,
    }));
  };
  return (
    <div className="drawing-options">
      <div
        className={`option ${draw.current === 'pan' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('pan')}
      >
        <FaHandPaper />
        <div className="txt">0</div>
      </div>
      <div
        className={`option ${
          draw.current === 'selection' ? 'option-active' : ''
        }`}
        onClick={() => setCurrentTool('selection')}
      >
        <FaMousePointer />
        <div className="txt">1</div>
      </div>
      <div
        className={`option ${draw.current === 'square' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('square')}
      >
        <FaSquare />
        <div className="txt">2</div>
      </div>
      <div
        className={`option ${
          draw.current === 'diamond' ? 'option-active' : ''
        }`}
        onClick={() => setCurrentTool('diamond')}
      >
        <FaGem />
        <div className="txt">3</div>
      </div>
      <div
        className={`option ${draw.current === 'circle' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('circle')}
      >
        <FaCircle />
        <div className="txt">4</div>
      </div>
      <div
        className={`option ${draw.current === 'arrow' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('arrow')}
      >
        <FaArrowRight />
        <div className="txt">5</div>
      </div>
      <div
        className={`option ${draw.current === 'line' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('line')}
      >
        <FaMinus />
        <div className="txt">6</div>
      </div>
      <div
        className={`option ${draw.current === 'draw' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('draw')}
      >
        <FaPencilAlt />
        <div className="txt">7</div>
      </div>
      <div
        className={`option ${draw.current === 'font' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('font')}
      >
        <FaFont />
        <div className="txt">8</div>
      </div>
      <div
        className={`option ${draw.current === 'image' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('image')}
      >
        <FaRegImage />
        <div className="txt">9</div>
      </div>
      <div
        className={`option ${draw.current === 'eraser' ? 'option-active' : ''}`}
        onClick={() => setCurrentTool('eraser')}
      >
        <FaEraser />
        <div className="txt">10</div>
      </div>
    </div>
  );
}
