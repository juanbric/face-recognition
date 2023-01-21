import { VStack } from '@chakra-ui/react'
import { getDownloadURL, listAll, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import MetaTag from '../components/MetaTag'
import { storage } from '../config/firebase'

export default function test() {
  // const [imageReferenceUpload, setImageReferenceUpload] = useState<string[]>([])

  // const imagesListRef = ref(storage, 'reference/')

  // const uploadReferenceImage = async () => {
  //   if (imageReferenceUpload.length === 0) return
  //   for (let i = 0; i < imageReferenceUpload.length; i++) {
  //     const imageRef = ref(
  //       storage,
  //       `reference/${imageReferenceUpload[i].name}/${imageReferenceUpload[i].name}`,
  //     )
  //     await uploadBytes(imageRef, imageReferenceUpload[i]).then((snapshot) => {
  //       getDownloadURL(snapshot.ref).then((url) => {
  //         setImageUrls((prev) => [...prev, url])
  //       })
  //     })
  //   }
  // }

    // const [imageUrls, setImageUrls] = useState<string[]>([])
  // const [nameList, setNameList] = useState<string[]>([])
  // const imagesListRef = ref(storage, 'reference/')


  // useEffect(() => {
  //   listAll(imagesListRef).then((response) => {
      
  //     response.items.forEach((item) => {
  //             getDownloadURL(item).then((url) => {
  //               setImageUrls((prev) => [...prev, url])
  //             })
  //           })

  //     setNameList(response.items.map(item => item.name.replace(/\.jpg$/, '')))
      
  //   })
  // }, [])

  // console.log("name array", nameList)
  // console.log("img url array", imageUrls)

  return (
    <div className="flex items-center justify-center">
      <MetaTag title={'Test'} />
      <VStack>
        hello
        {/* <input
          type="file"
          multiple
          onChange={(event:any) => {
            setImageReferenceUpload((prev) => [...prev, ...event.target.files])
          }}
        />
        <button
          className="text-sm py-2 mb-4 px-4 rounded-full border-0 font-semibold bg-blue-50 text-blue-700 mt-8 hover:bg-blue-100"
          onClick={uploadReferenceImage}
        >
          Upload images
        </button> */}
      </VStack>
    </div>
  )
}

// useEffect(() => {
//   listAll(imagesListRef).then((response) => {
//     response.items.forEach((item) => {
//       getDownloadURL(item).then((url) => {
//         setImageUrls((prev) => [...prev, url])
//       })
//     })
//   })
// }, [])
//       {imageUrls.map((url) => {
//         return <img src={url} />
//       })}
