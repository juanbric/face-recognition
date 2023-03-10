import { useEffect } from "react";

const useClearCanvas = (
  imageUrl: any,
  canvasRef: any,
  setLoadTags: any,
  setFormData: any,
  setShareResults: any
) => {
  useEffect(() => {
    if (imageUrl) {
      //@ts-ignore
      const ctx = canvasRef.current.getContext("2d");
      //@ts-ignore
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setLoadTags(false);
      setShareResults(false);
      //@ts-ignore
      canvasRef.current.innerHTML = "";
      setFormData({ grado: "", fecha: "" });
    }
  }, [imageUrl]);
};

export default useClearCanvas;
