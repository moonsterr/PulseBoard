import DrawOptions from '../components/DrawOptions';
import DrawCustomizations from '../components/DrawCustomizations';
import { createContext, useState, useRef, useEffect, useCallback } from 'react';
import { nanoid } from 'nanoid';
import Loading from '../components/Loading';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const DrawContext = createContext();

export default function CanvasInstance() {
  // Drawing tools and styles
  const [draw, setDraw] = useState({
    current: 'draw',
    square: {
      outline: '#000',
      fill: 'transparent',
      stroke_width: 2,
      transparency: 1,
    },
    diamond: {
      outline: '#000',
      fill: 'transparent',
      stroke_width: 2,
      transparency: 1,
    },
    circle: {
      outline: '#000',
      fill: 'transparent',
      stroke_width: 2,
      transparency: 1,
    },
    arrow: { outline: '#000', stroke_width: 2, transparency: 1 },
    line: { outline: '#000', stroke_width: 2, transparency: 1 },
    draw: { outline: '#000', stroke_width: 2, transparency: 1 },
    eraser: { stroke_width: 20, transparency: 1 },
    font: { outline: '#000', font_family: 1, stroke_width: 2, transparency: 1 },
    pan: {},
  });

  const [elements, setElements] = useState({});
  const [order, setOrder] = useState([]);
  console.log(elements);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panRef = useRef({ x: 0, y: 0 });
  const isPanningRef = useRef(false);

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState({
    loading: true,
    status: 'verifying',
  });
  const canvasId = searchParams.get('id');

  // ---------- Verify canvas access ----------
  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/canvas/verify`,
          {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ canvasId }),
          }
        );
        if (!res.ok) throw new Error('Verification failed');
        setLoading({ loading: true, status: 'fetching' });
        // Fetch initial canvas data here if needed
        console.log('hello');
        const res2 = await fetch(`${import.meta.env.VITE_API_URL}/${canvasId}`);
        const data = await res2.json();
        console.log(data);

        setLoading({ loading: false, status: 'done' });
        if (data.success) {
          const formattedElements = {};
          const formattedOrder = [];

          if (Array.isArray(data.data)) {
            data.data.forEach((el) => {
              formattedElements[el._id] = el;
              formattedOrder.push(el._id);
            });
          } else {
            for (const key in data.data) {
              formattedElements[key] = data.data[key];
              formattedOrder.push(key);
            }
          }

          setElements((prev) => ({ ...prev, ...formattedElements }));
          setOrder(formattedOrder);
        }
      } catch (err) {
        console.error(err);
        setLoading({ loading: true, status: 'failed' });
      }
    };
    verify();
  }, []);

  // ---------- Init canvas ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctxRef.current = canvas.getContext('2d');
  }, [loading]);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL_WS, {
      withCredentials: true,
    });
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);
  // ---------- Socket listeners ----------
  useEffect(() => {
    if (!socket) return;
    socket.on('element:new', ({ id, element }) => {
      setElements((prev) => ({ ...prev, [id]: element }));
      setOrder((prev) => [...prev, id]);
    });

    socket.on('element:update', ({ id, element }) => {
      setElements((prev) => ({ ...prev, [id]: element }));
    });

    return () => {
      socket.off('element:new');
      socket.off('element:update');
    };
  }, [socket]);

  // ---------- Utility functions ----------
  function findCurrentTool(e) {
    return {
      current: draw.current,
      ...draw[draw.current],
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    };
  }

  function setCtxContext(tool) {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.lineWidth = tool.stroke_width ?? 2;
    ctx.strokeStyle = tool.outline ?? '#000';
    ctx.globalAlpha = tool.transparency ?? 1;

    if (tool.current === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineCap = ['draw', 'line'].includes(tool.current) ? 'round' : 'butt';
      ctx.lineJoin = ['draw', 'line'].includes(tool.current)
        ? 'round'
        : 'miter';
    }
  }

  function drawElement(ctx, el) {
    const {
      type,
      startingPosition,
      endingPosition,
      points = [],
      style = {},
    } = el;
    setCtxContext({ ...style, current: type });

    const offsetX = pan.x;
    const offsetY = pan.y;

    const startX = (startingPosition?.x ?? 0) + offsetX;
    const startY = (startingPosition?.y ?? 0) + offsetY;
    const endX = (endingPosition?.x ?? startX) + offsetX;
    const endY = (endingPosition?.y ?? startY) + offsetY;

    const x = Math.min(startX, endX);
    const y = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);
    const shouldFill =
      style.fill &&
      style.fill.toLowerCase() !== '#ffffff' &&
      style.fill.toLowerCase() !== 'white';

    if (type === 'square') {
      ctx.beginPath();
      ctx.rect(x, y, width, height);
      if (shouldFill) (ctx.fillStyle = style.fill), ctx.fill();
      ctx.stroke();
    } else if (type === 'diamond') {
      const cx = x + width / 2;
      const cy = y + height / 2;
      ctx.beginPath();
      ctx.moveTo(cx, y);
      ctx.lineTo(x + width, cy);
      ctx.lineTo(cx, y + height);
      ctx.lineTo(x, cy);
      if (shouldFill) (ctx.fillStyle = style.fill), ctx.fill();
      ctx.closePath();
      ctx.stroke();
    } else if (type === 'circle') {
      const radius = Math.min(width, height) / 2;
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
      if (shouldFill) (ctx.fillStyle = style.fill), ctx.fill();
      ctx.stroke();
    } else if (type === 'line' || type === 'arrow') {
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      if (type === 'arrow')
        drawArrowHead(ctx, startX, startY, endX, endY, style.stroke_width ?? 2);
    } else if (type === 'draw' || type === 'eraser') {
      if (!points.length) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x + offsetX, points[0].y + offsetY);
      for (let i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x + offsetX, points[i].y + offsetY);
      ctx.stroke();
    } else if (type === 'text') {
      ctx.save();
      ctx.fillStyle = style.outline ?? '#000';
      ctx.font = `${style.font_size ?? 16}px sans-serif`;
      ctx.fillText(el.text || '', startX, startY);
      ctx.restore();
    }
  }

  function drawArrowHead(ctx, x1, y1, x2, y2, strokeWidth) {
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const headLength = Math.max(8, strokeWidth * 3);
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle - Math.PI / 6),
      y2 - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(x2, y2);
    ctx.lineTo(
      x2 - headLength * Math.cos(angle + Math.PI / 6),
      y2 - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  const redraw = useCallback(() => {
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const id of order) drawElement(ctx, elements[id]);
  }, [elements, order, pan]);

  useEffect(() => redraw(), [elements, order, pan, redraw]);

  // ---------- Drawing handlers ----------
  function onInitiateDraw(e) {
    const tool = findCurrentTool(e);

    if (tool.current === 'pan') {
      isPanningRef.current = true;
      panRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const ctx = ctxRef.current;
    setCtxContext(tool);

    const id = nanoid();
    let el = null;

    if (['draw', 'eraser'].includes(tool.current)) {
      el = {
        _id: id,
        type: tool.current,
        points: [{ x: tool.x - pan.x, y: tool.y - pan.y }],
        style: { ...draw[tool.current] },
      };
    } else if (
      ['square', 'diamond', 'circle', 'line', 'arrow', 'text'].includes(
        tool.current
      )
    ) {
      el = {
        _id: id,
        type: tool.current,
        startingPosition: { x: tool.x - pan.x, y: tool.y - pan.y },
        endingPosition: { x: tool.x - pan.x, y: tool.y - pan.y },
        style: { ...draw[tool.current] },
      };
    }

    if (el) {
      setElements((prev) => ({ ...prev, [id]: el }));
      setOrder((prev) => [...prev, id]);
      socket.emit('element:new', { id, element: el, canvasId });
    }

    if (ctx) ctx.beginPath(), ctx.moveTo(tool.x, tool.y);
    setIsDrawing(true);
  }

  function whileDrawing(e) {
    const tool = findCurrentTool(e);

    if (tool.current === 'pan') {
      if (!isPanningRef.current) return;
      const dx = e.clientX - panRef.current.x;
      const dy = e.clientY - panRef.current.y;
      panRef.current = { x: e.clientX, y: e.clientY };
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      return;
    }

    if (!isDrawing) return;
    const lastId = order[order.length - 1];
    if (!lastId) return;

    const ctx = ctxRef.current;

    if (['draw', 'eraser'].includes(tool.current)) {
      setElements((prev) => {
        const last = prev[lastId];
        if (!last || !['draw', 'eraser'].includes(last.type)) return prev;
        const updated = {
          ...last,
          points: [...last.points, { x: tool.x - pan.x, y: tool.y - pan.y }],
        };
        socket.emit('element:update', {
          id: lastId,
          element: updated,
          canvasId,
        });
        return { ...prev, [lastId]: updated };
      });
      if (ctx) ctx.lineTo(tool.x, tool.y), ctx.stroke();
    } else {
      setElements((prev) => {
        const last = prev[lastId];
        if (!last) return prev;
        const updated = {
          ...last,
          endingPosition: { x: tool.x - pan.x, y: tool.y - pan.y },
        };
        socket.emit('element:update', {
          id: lastId,
          element: updated,
          canvasId,
        });
        return { ...prev, [lastId]: updated };
      });
    }
  }

  function onExitDraw() {
    setIsDrawing(false);
    isPanningRef.current = false;
  }

  const contextValue = {
    draw,
    setDraw,
    elements,
    setElements,
    order,
    setOrder,
    startDrawing: onInitiateDraw,
    stopDrawing: onExitDraw,
    pan,
    setPan,
  };

  if (loading.loading) {
    let text = '';
    if (loading.status === 'verifying')
      text = 'Checking if you are allowed to interact with this canvas.';
    else if (loading.status === 'fetching')
      text = 'Grabbing canvas data and positions.';
    else if (loading.status === 'failed')
      text = 'Something went wrong, try again later.';
    return <Loading text={text} />;
  }

  return (
    <DrawContext.Provider value={contextValue}>
      <main>
        <DrawOptions />
        <canvas
          ref={canvasRef}
          onMouseDown={onInitiateDraw}
          onMouseMove={whileDrawing}
          onMouseUp={onExitDraw}
        />
        <DrawCustomizations />
      </main>
    </DrawContext.Provider>
  );
}

export { DrawContext };
