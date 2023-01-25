const PreviewImage = ({
  canvasRef,
  imageUrl,
}: {
  canvasRef: any;
  imageUrl: any;
}) => {
  return (
    <>
      {/* Image */}
      <div className="relative">
        <canvas ref={canvasRef} />
        <img src={imageUrl} width={800} height={600} className="rounded-lg"/>
      </div>
    </>
  );
};

export default PreviewImage;
