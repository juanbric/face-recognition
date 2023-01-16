const PreviewImage = ({
  canvasRef,
  imageUrl,
  isLoading,
}: {
  canvasRef: any;
  imageUrl: any;
  isLoading: any;
}) => {
  return (
    <>
      {/* Image */}
      <div className="relative">
        <canvas ref={canvasRef} />
        <img src={imageUrl} width={800} height={600} />
      </div>
      {/* Loading results */}
      {isLoading ? (
        <p className="text-sm text-slate-500 mt-2">
          Cargando resultados de reconocimiento...
        </p>
      ) : null}
    </>
  );
};

export default PreviewImage;
