const ShareResults = ({
  shareResults,
  faceMatches,
}: {
  shareResults: any;
  faceMatches: any;
}) => {
  let names = faceMatches ? faceMatches.toString().split(",") : [];
  let extractedNames = [];

  for (let i = 0; names && i < names.length; i++) {
    let name = names[i].trim();
    if (name.includes("NEGATIVO")) {
      let extractedName = name.split("NEGATIVO")[0].trim(); // Extract name without NEGATIVO suffix
      extractedNames.push(extractedName);
    }
  }

  const namesArray = faceMatches?.toString().replace(/[\(\)\d\.]/g, "").split(",");
  if (namesArray?.length > 1) {
    namesArray[namesArray.length - 1] = "y " + namesArray[namesArray.length - 1];
  }
  
  // Join the items with comma and "y" (if present)
  const formattedString = namesArray?.join(namesArray.length > 2 ? ", " : " ");
  

  return (
    <>
      {shareResults &&
        (faceMatches?.toString().includes("NEGATIVO") ? (
          <div
            id="alert-border-2"
            className="flex p-4 text-red-800 border-t-4 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div className="ml-3 text-sm font-medium">
              Tu escuela no tiene permiso para compartir la foto de{" "}
              {extractedNames}.
            </div>
          </div>
        ) : (
          <div
            id="alert-border-3"
            className="flex p-4 text-green-800 border-t-4 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <div className="ml-3 text-sm font-medium">
              Tu escuela tiene permiso para compartir la foto de {formattedString}
            </div>
          </div>
        ))}
    </>
  );
};

export default ShareResults;
