const InputField = ({
  loaded,
  handleImageChange,
}: {
  loaded: boolean;
  handleImageChange: any;
}) => {
  return (
    <>
      {loaded === true ? (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-4 file:py-2 mb-8 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-700  file:text-white  hover:file:bg-[#DD3F31]"
        />
      ) : (
        <p className="text-sm text-slate-400">Cargando...</p>
      )}
    </>
  );
};

export default InputField;
