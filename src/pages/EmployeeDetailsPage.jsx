import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useEmployeeData } from '../hooks/useEmployeeData';

export default function EmployeeDetailsPage() {
  const { id } = useParams();
  const { employees, loading, error } = useEmployeeData();
  const employee = useMemo(() => employees.find((entry) => entry.id === id), [employees, id]);

  const videoRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const signatureCanvasRef = useRef(null);
  const [photoDataUrl, setPhotoDataUrl] = useState('');
  const [mergedDataUrl, setMergedDataUrl] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  useEffect(() => {
    let stream;

    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError('Unable to access camera permissions.');
      }
    }

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = photoCanvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext('2d');
    canvas.width = 440;
    canvas.height = 280;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotoDataUrl(canvas.toDataURL('image/png'));
  };

  const pointFromEvent = (event) => {
    const rect = signatureCanvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  };

  const startDraw = (event) => {
    event.preventDefault();
    setIsDrawing(true);
    setLastPoint(pointFromEvent(event));
  };

  const draw = (event) => {
    if (!isDrawing || !signatureCanvasRef.current || !lastPoint) return;

    event.preventDefault();
    const context = signatureCanvasRef.current.getContext('2d');
    const current = pointFromEvent(event);

    context.strokeStyle = '#111827';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(current.x, current.y);
    context.stroke();

    setLastPoint(current);
  };

  const endDraw = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    startDraw({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => event.preventDefault(),
    });
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    draw({
      clientX: touch.clientX,
      clientY: touch.clientY,
      preventDefault: () => event.preventDefault(),
    });
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const mergeImages = () => {
    if (!photoDataUrl || !signatureCanvasRef.current) return;

    const photo = new Image();
    photo.onload = () => {
      const compositeCanvas = document.createElement('canvas');
      compositeCanvas.width = photo.width;
      compositeCanvas.height = photo.height;
      const context = compositeCanvas.getContext('2d');

      context.drawImage(photo, 0, 0);
      context.drawImage(
        signatureCanvasRef.current,
        0,
        photo.height - signatureCanvasRef.current.height,
        signatureCanvasRef.current.width,
        signatureCanvasRef.current.height,
      );

      setMergedDataUrl(compositeCanvas.toDataURL('image/png'));
    };
    photo.src = photoDataUrl;
  };

  if (loading) return <p>Loading employee...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <section className="card details-page">
      <Link to="/list">← Back to list</Link>
      <h1>{employee.name}</h1>
      <p>{employee.title}</p>
      <p>
        {employee.department} • {employee.city}
      </p>

      <div className="media-grid">
        <div>
          <h3>Camera Capture</h3>
          <video autoPlay className="camera" ref={videoRef} />
          {cameraError && <p className="error">{cameraError}</p>}
          <button onClick={capturePhoto} type="button">
            Capture Photo
          </button>
          <canvas className="hidden" ref={photoCanvasRef} />
          {photoDataUrl && <img alt="Captured employee" className="preview" src={photoDataUrl} />}
        </div>

        <div>
          <h3>Signature Overlay</h3>
          <canvas
            className="signature-canvas"
            height={120}
            onMouseDown={startDraw}
            onMouseLeave={endDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onTouchEnd={endDraw}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            ref={signatureCanvasRef}
            width={440}
          />
          <div className="row-gap">
            <button onClick={clearSignature} type="button">
              Clear Signature
            </button>
            <button onClick={mergeImages} type="button">
              Merge Photo + Signature
            </button>
          </div>
          {mergedDataUrl && <img alt="Merged employee card" className="preview" src={mergedDataUrl} />}
        </div>
      </div>
    </section>
  );
}
