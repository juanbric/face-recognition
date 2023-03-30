const RecognizeButton = ({
  showRecognize,
  handleRecognition,
  isLoading,
}: {
  showRecognize: any;
  handleRecognition: any;
  isLoading: any;
}) => {
  return (
    <>
      {showRecognize ? (
        <button
          onClick={handleRecognition}
          className="text-sm py-2 mb-6 px-4 rounded-lg font-semibold border-0 bg-gray-100 text-blackk hover:bg-[#3c31dd] hover:text-white"
        >
          ¡Reconoce!
        </button>
      ) : null}
      {/* Loading results */}
      {isLoading ? (
        <p className="text-sm text-slate-400 mt-6">
          Cargando resultados de reconocimiento...
        </p>
      ) : null}
    </>
  );
};

export default RecognizeButton;
