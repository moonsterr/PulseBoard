// DrawCustomizations.jsx
import { useContext } from 'react';
import { DrawContext } from '../pages/CanvasInstance';
import { FaMinus } from 'react-icons/fa';
import CustomRange from './customRange';
import { FaCode, FaItalic, FaPencil } from 'react-icons/fa6';
import { TbLetterA } from 'react-icons/tb';

export default function DrawCustomizations() {
  const { draw, setDraw } = useContext(DrawContext);

  const setTool = (key, value) => {
    setDraw((prevDraw) => ({
      ...prevDraw,
      [draw.current]: {
        ...prevDraw[draw.current],
        [key]: value,
      },
    }));
  };

  if (
    draw.current === 'pan' ||
    draw.current === 'selection' ||
    !draw.current ||
    draw.current === 'eraser' ||
    draw.current === 'image'
  )
    return null;

  return (
    <div className="draw-customizations">
      {/* Stroke */}
      <div className="field">
        <p className="field-title">Stroke</p>
        <div className="color-selection">
          <div className="color-selection-defaults">
            {['black', 'red', 'green', 'blue', 'orange'].map((color) => (
              <div
                key={color}
                onClick={() => setTool('outline', color)}
                className={`color-select-option ${color} ${
                  draw[draw.current].outline === color ? 'option-active' : ''
                }`}
              ></div>
            ))}
          </div>
          <div className="color-selection-custom">
            <div
              className="custom-color color-select-option"
              style={{ backgroundColor: draw[draw.current].outline }}
            ></div>
            <input
              type="text"
              placeholder="HEX code"
              value={draw[draw.current].outline}
              onChange={(e) => setTool('outline', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Background */}
      {draw.current !== 'font' && draw.current !== 'draw' && (
        <div className="field">
          <p className="field-title">Background</p>
          <div className="color-selection">
            <div className="color-selection-defaults">
              {['transparent', 'pink', 'mint', 'lightblue', 'yellow'].map(
                (color) => (
                  <div
                    key={color}
                    onClick={() => setTool('fill', color)}
                    className={`color-select-option ${color} ${
                      draw[draw.current].fill === color ? 'option-active' : ''
                    }`}
                  ></div>
                )
              )}
            </div>
            <div className="color-selection-custom">
              <div
                className="custom-color color-select-option"
                style={{
                  backgroundColor:
                    draw[draw.current].fill !== 'mint'
                      ? draw[draw.current].fill
                      : '#b2f2bb',
                }}
              ></div>
              <input
                type="text"
                placeholder="HEX code"
                value={draw[draw.current].fill}
                onChange={(e) => setTool('fill', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Font */}
      {draw.current === 'font' && (
        <div className="field">
          <div className="field-title">Font</div>
          <div className="stroke-width-options">
            <div
              className={`width-option ${
                draw.font.font_family === 0 ? 'option-active' : ''
              }`}
              onClick={() => setTool('font_family', 0)}
            >
              <FaPencil />
            </div>
            <div
              className={`width-option ${
                draw.font.font_family === 1 ? 'option-active' : ''
              }`}
              onClick={() => setTool('font_family', 1)}
            >
              <TbLetterA />
            </div>

            <div
              className={`width-option ${
                draw.font.font_family === 2 ? 'option-active' : ''
              }`}
              onClick={() => setTool('font_family', 2)}
            >
              <FaCode />
            </div>

            <div
              className={`width-option ${
                draw.font.font_family === 3 ? 'option-active' : ''
              }`}
              onClick={() => setTool('font_family', 3)}
            >
              <FaItalic />
            </div>
          </div>
        </div>
      )}

      {/* Stroke width */}
      <div className="field">
        <p className="field-title">Stroke width</p>
        <div className="stroke-width-options">
          <div
            className={`width-option ${
              draw[draw.current].stroke_width === 2 ? 'option-active' : ''
            }`}
            onClick={() => setTool('stroke_width', 2)}
          >
            <FaMinus className="small-minus" />
          </div>
          <div
            className={`width-option ${
              draw[draw.current].stroke_width === 8 ? 'option-active' : ''
            }`}
            onClick={() => setTool('stroke_width', 8)}
          >
            <FaMinus className="medium-minus" />
          </div>
          <div
            className={`width-option ${
              draw[draw.current].stroke_width === 16 ? 'option-active' : ''
            }`}
            onClick={() => setTool('stroke_width', 16)}
          >
            <FaMinus className="big-minus" />
          </div>
        </div>
      </div>

      {/* Opacity */}
      <p>Opacity</p>
      <CustomRange setTool={setTool} />
    </div>
  );
}
