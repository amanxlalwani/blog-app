export default function BlogSkeleton() {
  return (
    <>
      <div role="status" className=" animate-pulse">
        <hr className="border mt-10 border-gray-200" />

        <div className="mt-12 ">
          <div className="flex">
            <div className="h-4 bg-gray-200 rounded-full  w-48 "> </div>
            <div>·</div>
            <div className="h-4 bg-gray-200 rounded-full  w-48 "> </div>
          </div>

          <div className="h-5 bg-gray-200 rounded-full  w-full mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full  w-full  mb-4"></div>
          <div className="h-2 bg-gray-200 rounded-full  w-full  mb-4"></div>
        </div>

        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}
