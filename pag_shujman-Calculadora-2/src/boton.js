const Boton = ({ label, onClick, span = 1 }) => {
  return (
    <button
      onClick={() => onClick(label)}
      className={`bg-red-800 hover:bg-red-800 active:bg-red-400 transition duration-150 ease-in-out
      text-white font-bold py-4 rounded-xl text-xl shadow-md col-span-${span}`}
    >
      {label}
    </button>
  );
};

export default Boton;
