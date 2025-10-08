import { useEffect, useState } from 'react';

export default function CustomRange({ setTool }) {
  const [value, setValue] = useState(1);
  useEffect(() => {
    setTool('transparency', value);
  }, [value]);
  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{
          width: '260px',
          height: '8px',
          borderRadius: '6px',
          appearance: 'none',
          background: `linear-gradient(to right, #d7c4fcff ${
            value * 100
          }%, #eee ${value * 100}%)`,
          outline: 'none',
          margin: '0px',
        }}
      />
      <p>Value: {value}</p>
    </div>
  );
}
