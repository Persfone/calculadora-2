import { useState, useEffect} from 'react';
import Boton from './boton';
import { parseAndEvaluate } from './parser';
import './App.css';

function App() {
  const [input, setInput] = useState('');

  const agregarCaracter = (char) => setInput((prev) => prev + char);
  const resetearCalculadora = () => setInput(''); // Nueva función para resetear

  const calcularResultado = () => {
    try {
      const resultado = parseAndEvaluate(input);
      setInput(resultado.toString());
    } catch {
      setInput('Syntax Error');
    }
  };

  const manejarCambio = (e) => {
    const valor = e.target.value;
    const soloPermitidos = valor.replace(/[^\d+\-*/.]/g, '');
    setInput(soloPermitidos);
  };

  useEffect(() => {
    const manejarTecla = (e) => {
      const { key } = e;
      if ("0123456789+-*/.".includes(key)) return;
      if (key === "Enter") {
        e.preventDefault();
         
        try {
          const resultado = parseAndEvaluate(input);
          setInput(resultado.toString());
        } catch {
          setInput("Syntax Error");
        }
      }
    };
  
    window.addEventListener("keydown", manejarTecla);
    return () => window.removeEventListener("keydown", manejarTecla);
  }, [input]);
  

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl mb-6 font-bold text-sky-400">Calculadoura</h1>
      <input
        type="text"
        value={input}
        onChange={manejarCambio}
        className="bg-zinc-800 text-white text-3xl w-full max-w-sm p-4 mb-6 rounded-xl shadow-inner text-right outline-none border border-zinc-700 focus:ring-2 focus:ring-sky-400"
      />
      <div className="grid grid-cols-4 gap-3 w-full max-w-sm">
        {[
          'C', 7, 8, 9, '/',
          4, 5, 6, '*',
          1, 2, 3, '-',
          0, '.', '=', '+'
        ].map((label, i) => (
          <Boton
            key={i}
            label={label}
            onClick={(l) => {
              if (l === '=') calcularResultado();
              else if (l === 'C') resetearCalculadora();
              else agregarCaracter(l);
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;