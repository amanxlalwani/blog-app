import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useSigned from "../hooks/useSigned";
import BlogPageSkeleton from "../components/BlogPageSkeleton";
import Nav from "../components/Nav";
import { toast } from "react-toastify";
import { useProfile } from "../hooks/useProfile";

export default function UpdateBlog() {
  const { id } = useParams();
  const { modal, setModal } = useProfile();

  const [loading, setLoading] = useState(true);
  const [isBlur, setIsBlur] = useState(false);

  const [blog, setBlog] = useState({ title: "", content: "" });
  const navigate = useNavigate();
  const { isSigned, isLoading, email } = useSigned();

  useEffect(() => {
    axios
      .get("https://backend.aman-lalwani208.workers.dev/api/v1/blog/" + id, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(function (res) {
        setLoading(false);

        setBlog({ title: res.data.blog.title, content: res.data.blog.content });
      })
      .catch(function () {
        navigate("/signup");
      });
  }, [id]);

  if (isLoading || loading) {
    return (
      <>
        <Nav
          setIsBlur={setIsBlur}
          email={email}
          modal={modal}
          setModal={setModal}
        ></Nav>
        <div className={modal || isBlur ? "blur-sm  select-none" : ""}>
          <BlogPageSkeleton></BlogPageSkeleton>
        </div>
      </>
    );
  }

  if (!isSigned) {
    navigate("/signin");
  }

  return (
    <>
      <div className="flex justify-between px-4  mt-20 pb-8 lg:mt-4">
        <Link to="/blogs">
          <div className="text-3xl font-bold">Sadhan</div>
        </Link>
        <div
          className=" w-20 bg-green-600 flex justify-center items-center rounded cursor-pointer"
          onClick={async () => {
            if (blog.title == "" || blog.content == "") {
              toast.error("Fields cannot empty");
              return;
            }
            setLoading(true);
            try {
              const res = await axios.put(
                "https://backend.aman-lalwani208.workers.dev/api/v1/blog/" + id,
                blog,
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );
              setLoading(false);
              if (res.status != 200) toast.error(res.data.message);
              else {
                toast.info(res.data.message);
                navigate("/myblogs");
              }
            } catch (err: any) {
              setLoading(false);
              console.log(err);
              const message = err.response.data["message"];
              toast.error(message);
            }
          }}
        >
          Update
        </div>
      </div>
      <div className="flex flex-col w-10/12 lg:w-1/2 lg:gap-12 m-auto lg:mt-4 ">
        <div>
          <input
            type="text"
            value={blog.title}
            className="lg:text-7xl text-3xl mt-8 lg:mt-0 w-full focus:outline-none"
            onChange={(e) => {
              setBlog({ ...blog, title: e.target.value });
            }}
            placeholder="Title"
            autoFocus={true}
          />{" "}
          <br />
          <textarea
            value={blog.content}
            className="lg:text-2xl text-md mt-4 lg:mt-0 w-full focus:outline-none"
            onChange={(e) => {
              setBlog({ ...blog, content: e.target.value });
            }}
            maxLength={5000000000}
            rows={4000}
            placeholder="Tell your story..."
          />
        </div>
      </div>
    </>
  );
}
