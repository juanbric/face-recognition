const Tags = ({
  faceMatches,
  formData,
  handleTagsChange,
  loadTags,
}: {
  faceMatches: any
  formData: any
  handleTagsChange: any
  loadTags: any
}) => {
  return (
    <>
      {loadTags && (
        <>
          <p className="text-lg text-slate-500 mt-6">
            Añada etiquetas correspondientes para subir foto a base de datos
          </p>
          <form className="mt-4 text-sm text-bold mr-1 text-slate-500">
            <label>
              Grado:
              <input
                type="text"
                name="grado"
                className="ml-2 text-sm text-slate-500 outline-none p-1 rounded-[8px] w-10 bg-blue-50 mb-4"
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
                className="ml-2 text-sm text-slate-500 outline-none p-1 rounded-[8px] w-[120px] bg-blue-50"
                value={formData.fecha}
                onChange={handleTagsChange}
              />
            </label>
          </form>
        </>
      )}
    </>
  )
}

export default Tags
