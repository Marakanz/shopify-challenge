import axios from "axios"
import { Fragment, useEffect, useState } from 'react';
import Moonlight from "./images/moonlight.jpg";
import ClipLoader from "react-spinners/ClipLoader";
import { useInfiniteQuery } from "react-query";


function App() {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [color, setColor] = useState("#1E22EE")
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=E1F7IlNuXHbLNHkwtFoWyjOfeadD2eXmzzLw9hj1`;
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery(
    'projects',
    async ({ pageParam = 1 }) => {
      const response = await axios.get(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=${pageParam}&api_key=E1F7IlNuXHbLNHkwtFoWyjOfeadD2eXmzzLw9hj1`);
      console.log(response.data.photos)
      setLoading(false);
      return response.data.photos
    },
    {
      getNextPageParam: (_lastPage, pages) => {
        if (pages.length < 10) {
          return pages.length + 1;
        } else {
          return undefined
        }
      }
    }
  )

  return (
    <div className="App body">
      <h1 className='text-3xl font-semibold text-center'>Shopify Challenge</h1>
      {loading && (
        <div className="flex justify-center items-center h-screen">
          <ClipLoader color={color} loading={loading} size={150} />
        </div>
      )}
      <div className='flex flex-wrap mx-auto justify-center'>
        {data?.pages.map((group, index) => (
          <Fragment key={index}>
            {group?.map((image, index) => (
              <div key={image.id} className='m-6 shadow-md rounded-xl'>
                <div className='w-72'>
                  {image.img_src ? <img src={image.img_src} className='h-64 w-full rounded-t-lg object-cover' /> : <img src={Moonlight} className='h-64 w-64 object-cover' />}
                  <div className='py-4 px-3 bg-gray-50'>
                    <h1 className='text-xl font-semibold text-center leading-3 mb-4'> {`${image.rover.name} Rover - `}
                      <span className='text-base font-normal text-gray-400'>{image.camera.full_name} </span></h1>
                    <p> This is a image post</p>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <div className="flex justify-center  my-5">
        <button disabled={!hasNextPage} onClick={fetchNextPage} className="button"> Load more</button>
      </div>
    </div>
  );
}

export default App;
