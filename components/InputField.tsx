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
          className="text-sm text-slate-500 file:mr-4 file:py-2 mb-8 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 first-letter:hover:file:bg-blue-100"
        />
      ) : (
        <p className="text-sm text-slate-500">Cargando...</p>
      )}
    </>
  );
};

export default InputField;
