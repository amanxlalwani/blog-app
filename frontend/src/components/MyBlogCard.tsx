import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function dateExtract(publish_date: string) {
  return publish_date.slice(0, 10);
}

export default function MyBlogCard({
  id,
  title,
  content,
  publish_date,
  author,
  setBlogs,
}: {
  id: string;
  title: string;
  content: string;
  publish_date: string;
  author: { name: string };
  setBlogs: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        title: string;
        content: string;
        publish_date: string;
        author: {
          name: string;
        };
      }[]
    >
  >;
}) {
  const navigate = useNavigate();

  return (
    <>
      <hr className="border mt-10 border-gray-200" />
      <div className="mt-12 w-full cursor-pointer break-words  ">
        <div className="text-base">
          {author.name} ·{" "}
          <span className="text-gray-500">{dateExtract(publish_date)}</span>{" "}
        </div>
        <div className="text-2xl font-bold ">{title}</div>
        <div className="multiLineLabel w-full">
          <div className=" max-w-full textMaxLine  ">{content}</div>
          <div className="flex gap-4">
            <button
              className="bg-blue-500 p-2 rounded mt-4"
              type="button"
              onClick={() => {
                navigate("/updateblog/" + id);
              }}
            >
              Update
            </button>
            <button
              className="bg-red-500 p-2 rounded mt-4"
              type="button"
              onClick={async () => {
                try {
                  const res = await axios.delete(
                    "https://backend.aman-lalwani208.workers.dev/api/v1/blog/" +
                      id,
                    {
                      data: {},
                      headers: {
                        Authorization: localStorage.getItem("token"),
                      },
                    }
                  );

                  navigate("/myblogs");

                  if (res.status == 404) {
                    toast.error(res.data.message);
                  } else {
                    setBlogs((blogs) => blogs.filter((blog) => blog.id !== id));
                    toast.info(res.data.message);
                  }
                } catch (err) {
                  toast.error("Something went wrong");
                  console.log(err);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
