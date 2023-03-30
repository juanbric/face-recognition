const Tags = ({
  formData,
  handleTagsChange,
  loadTags,
}: {
  formData: any;
  handleTagsChange: any;
  loadTags: any;
}) => {
  return (
    <>
      {loadTags && (
        <>
          <p className="text-slate-600 pt-8 pb-2">
            Añade las tags correspondientes para subir la foto a la base de
            datos
          </p>
          <form className="mt-4 text-sm text-bold mr-1 text-slate-500">
            <label className="my-4 flex items-center gap-6">
              <p className="items-center">Grado:</p>
              <input
                type="text"
                name="grado"
                className="text-gray-900 sm:text-sm rounded-lg block w-1/3 p-2.5 outline-none dark:bg-gray-100  dark:text-black"
                value={formData.grado}
                onChange={handleTagsChange}
              />
            </label>
            <br />
            <label className="flex items-center gap-6">
              <p className="items-center">Fecha:</p>
              <input
                type="text"
                name="fecha"
                className="text-gray-900 sm:text-sm rounded-lg block w-1/3 p-2.5 outline-none dark:bg-gray-100  dark:text-black"
                value={formData.fecha}
                onChange={handleTagsChange}
              />
            </label>
          </form>
        </>
      )}
    </>
  );
};

export default Tags;
