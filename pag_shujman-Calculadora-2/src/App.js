import { useState, useEffect, useRef} from 'react';
import Boton from './boton';
import { parseAndEvaluate } from './parser';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [historial, setHistorial] = useState([]);
  const [indiceHistorial, setIndiceHistorial] = useState(-1);
  const audioRef = useRef(null);

  const timeoutRef = useRef(null);
  const [showImages, setShowImages] = useState(false);

  const imageUrls = [
    '/llamada.png',
    '/react.png',
    '/tarea.jpg'
  ];

  const agregarCaracter = (char) => setInput((prev) => prev + char);
  const resetearCalculadora = () => setInput('');  

  const calcularResultado = () => {
    try {
      const resultado = parseAndEvaluate(input);
      const nuevaOperacion = input;
      setInput(resultado.toString());
  
      setHistorial((prev) => {
        const actualizado = [nuevaOperacion, ...prev];
        return actualizado.slice(0, 10);
      });
  
      setIndiceHistorial(-1);
  
    
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowImages(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Error al reproducir audio:', e));
      }
      timeoutRef.current = setTimeout(() => {
        setShowImages(false);
      }, 19000);
  
    } catch {
      setInput('Syntax Error');
    }
  };

  const manejarCambio = (e) => {
    const valor = e.target.value;
    const soloPermitidos = valor.replace(/[^\d+\-*/().]/g, '');  
    setInput(soloPermitidos);
  };

  useEffect(() => {
    audioRef.current = new Audio('/intro.mp3');
  }, []);

  useEffect(() => {
    const manejarTecla = (e) => {
      const { key } = e;
      if ("0123456789+-*/.()".includes(key)) return;
      if (key === "Enter") {
        e.preventDefault();
        calcularResultado();
      }
      if (key === "ArrowUp") {
        e.preventDefault();
        setIndiceHistorial((prev) => {
          const nuevoIndice = Math.min(prev + 1, historial.length - 1);
          if (historial[nuevoIndice]) setInput(historial[nuevoIndice]);
          return nuevoIndice;
        });
      }
      if (key === "ArrowDown") {
        e.preventDefault();
        setIndiceHistorial((prev) => {
          const nuevoIndice = Math.max(prev - 1, -1);
          if (nuevoIndice === -1) setInput('');
          else if (historial[nuevoIndice]) setInput(historial[nuevoIndice]);
          return nuevoIndice;
        });
      }
    };

    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [historial]);

  return (
    <>
      {showImages && (
        <>
          <img 
            src={imageUrls[1]} 
            alt="Imagen 1" 
            className="absolute top-24 left-4 w-49 h-49 z-10 animate-pulse"
          />
          <img 
            src={imageUrls[0]} 
            alt="Imagen 2" 
            className="absolute bottom-16 right-80 w-48 h-48 z-10 animate-spin"
          />
          <img 
            src={imageUrls[2]} 
            alt="Imagen 3" 
            className="absolute top-24 right-32 w-50 h-50 z-0 animate-bounce"
          />
        </>
      )}
  
      <div
        className="min-h-screen w-full bg-cover bg-center flex flex-row justify-center items-start p-8 gap-8"
        style={{ backgroundImage: 'url("/info.jpg")' }}
      >
        {/* Calculadora */}
        <div className="flex flex-col items-center w-full max-w-sm bg-transparent p-6 rounded-xl">
          <h1 className="text-5xl mb-6 font-extrabold text-sky-400 drop-shadow">CalculaDOUra</h1>
          <input
            type="text"
            value={input}
            onChange={manejarCambio}
            className="bg-red-800 text-white text-3xl w-full p-4 mb-6 rounded-xl shadow-inner text-right outline-none border border-white focus:ring-2 focus:ring-red-400"
          />
          <div className="grid grid-cols-4 gap-3 w-full">
            {[
              'C', '(', ')', '/',
              7, 8, 9, '*',
              4, 5, 6, '-',
              1, 2, 3, '+',
              0, '.', '=', 
            ].map((label, i) => (
              <Boton
                key={i}
                label={label}
                onClick={(l) => {
                  if (l === '=') calcularResultado();
                  else if (l === 'C') resetearCalculadora();
                  else agregarCaracter(l.toString());
                }}
              />
            ))}
          </div>
        </div>
  
        {/* Historial */}
        {historial.length > 0 && (
          <div className="bg-transparent rounded-xl p-6 w-72 max-h-[500px] overflow-y-auto">
            <h2 className="text-red-800 font-bold mb-4 text-2xl text-center drop-shadow">HistoREAL</h2>
            <ul className="list-disc pl-5 space-y-2 text-2xl text-zinc-200">
              {historial.map((op, idx) => (
                <li
                  key={idx}
                  className="cursor-pointer hover:text-red-800"
                  onClick={() => setInput(op)}
                >
                  {op}
                </li>
              ))} 
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default App;