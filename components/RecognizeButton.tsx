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
          className="text-sm py-2 my-6 px-4 rounded-full border-0 font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          ¡Reconoce!
        </button>
      ) : null}
      {/* Loading results */}
      {isLoading ? (
        <p className="text-sm text-slate-500 mt-6">
          Cargando resultados de reconocimiento...
        </p>
      ) : null}
    </>
  );
};

export default RecognizeButton;
