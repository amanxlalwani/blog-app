export default function CommentSkeleton() {
  return (
    <>
      <div role="status" className=" animate-pulse">
        <div className="h-8 mt-4 bg-gray-200 rounded-full  w-48 "> </div>

        <div className="h-12 mt-4  bg-gray-200 rounded-full  w-full "> </div>

        <div className="h-5 mt-4 bg-gray-200 rounded-full  w-full mb-4"></div>
        <div className="h-2 mt-4 bg-gray-200 rounded-full  w-full  mb-4"></div>
        <div className="h-2 mt-4 bg-gray-200 rounded-full  w-full  mb-4"></div>
        <div className="h-2 mt-4 bg-gray-200 rounded-full  w-full  mb-4"></div>
        <div className="h-2 mt-4 bg-gray-200 rounded-full  w-full  mb-4"></div>
        <div className="h-2 mt-4 bg-gray-200 rounded-full  w-full  mb-4"></div>
        <div className="h-2 mt-4 bg-gray-200 rounded-full  w-full  mb-4"></div>
      </div>

      <span className="sr-only">Loading...</span>
    </>
  );
}
