const RecognizeButton = ({
  showRecognize,
  handleRecognition,
}: {
  showRecognize: any;
  handleRecognition: any;
}) => {
  return (
    <>
      {showRecognize ? (
        <button
          onClick={handleRecognition}
          className="text-sm py-2 mb-4 px-4 rounded-full border-0 font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
        >
          ¡Reconoce!
        </button>
      ) : null}
    </>
  );
};

export default RecognizeButton;
