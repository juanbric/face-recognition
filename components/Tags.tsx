const Tags = ({
  faceMatches,
  formData,
  handleTagsChange,
}: {
  faceMatches: any;
  formData: any;
  handleTagsChange: any;
}) => {
  return (
    <>
      {faceMatches && (
        <form className="mt-[148px] text-lg text-bold mr-2 text-slate-500">
          <label>
            Grado:
            <input
              type="text"
              name="grado"
              className="ml-4 outline-none p-1 rounded-[12px] w-10 bg-[#f6f6f6] mb-4"
              value={formData.grado}
              onChange={handleTagsChange}
            />
          </label>
          <br />
          <label>
            Fecha:
            <input
              type="text"
              name="fecha"
              className="ml-4 outline-none p-1 rounded-[12px] w-[120px] bg-[#f6f6f6]"
              value={formData.fecha}
              onChange={handleTagsChange}
            />
          </label>
          <br />
        </form>
      )}
    </>
  );
};

export default Tags;
