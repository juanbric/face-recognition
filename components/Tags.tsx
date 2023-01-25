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
          <p className="text-slate-400 pt-[60px] pb-2">
            Añade las tags correspondientes para subir la foto a la base de
            datos
          </p>
          <form className="mt-4 text-sm text-bold mr-1 text-slate-500">
            <label className="my-4 flex items-center gap-6">
              <p className="items-center">Grado:</p>
              <input
                type="text"
                name="grado"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
