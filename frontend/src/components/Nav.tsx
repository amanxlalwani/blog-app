import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useProfile } from "../hooks/useProfile";
import UpdateProfile from "./UpdateProfile";

import axios from "axios";
import BlogCard from "./BlogCard";

export default function Nav({
  email,
  modal,
  setModal,
  setIsBlur,
}: {
  email: string;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsBlur: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [openDropdown, setOpenDropDown] = useState(false);
  const { profile, setProfile } = useProfile();
  const [filter, setFilter] = useState("");
  const [searchedBlogs, setsearchedBlogs] = useState([]);

  const navigate = useNavigate();
  function toggleDropDown() {
    setOpenDropDown(!openDropdown);
  }

  function nooflikes(likes: { userId: string; has_liked: boolean }[]): number {
    var c = 0;
    likes.forEach((element) => {
      if (element.has_liked) {
        c++;
      }
    });
    return c;
  }

  useEffect(() => {
    let id = setTimeout(() => {
      axios
        .get(
          `https://backend.aman-lalwani208.workers.dev/api/v1/blog/search?filter=${filter}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(function (res) {
          // setLoading(false)
          setsearchedBlogs(res.data.blogs);
        })
        .catch(function (err) {
          console.log(err);
        });
    }, 500);

    return () => {
      clearTimeout(id);
    };
  }, [filter]);

  if (searchedBlogs.length > 0) {
    setIsBlur(true);
  } else {
    setIsBlur(false);
  }

  return (
    <>
      {modal ? (
        <>
          <UpdateProfile
            setModal={setModal}
            profile={profile}
            setProfile={setProfile}
          ></UpdateProfile>
        </>
      ) : null}

      <div className={modal ? "blur-sm select-none" : ""}>
        <nav className="w-full flex justify-between h-12 items-center px-6 mt-2">
          <Link to="/blogs">
            {" "}
            <div className="lg:text-3xl  font-bold">Sadhan</div>
          </Link>
          <div className="relative w-2/3  md:w-1/2 md:mr-16">
            <div className="relative">
              <input
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                type="text"
                id="simple-search"
                className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5  "
                placeholder="Search blogs..."
                required
              />
              {searchedBlogs.length > 0 ? (
                <div
                  onClick={() => setsearchedBlogs([])}
                  className="absolute right-0 bottom-0 flex cursor-pointer flex items-center justify-center  h-full px-6"
                >
                  <img
                    className="h-4 w-4 md:h-8 md:w-8"
                    src="https://img.icons8.com/ios-glyphs/30/multiply.png"
                    alt="multiply"
                  />
                </div>
              ) : null}
            </div>

            {searchedBlogs.length > 0 ? (
              <div className=" absolute right-90 h-screen w-full  bg-white overflow-y-scroll lg:m-auto z-10 px-2 px-4 pb-8 ">
                {searchedBlogs.map(
                  (blog: {
                    id: string;
                    title: string;
                    content: string;
                    publish_date: string;
                    author: { name: string };
                    likes: [{ userId: string; has_liked: boolean }];
                    liked: boolean;
                  }) => {
                    return (
                      <BlogCard
                        likes={nooflikes(blog.likes)}
                        id={blog.id}
                        title={blog.title}
                        content={blog.content}
                        publish_date={blog.publish_date}
                        author={blog.author}
                      ></BlogCard>
                    );
                  }
                )}
              </div>
            ) : null}
          </div>
          <div className="cursor-pointer" onClick={toggleDropDown}>
            <img
              className="rounded-full md:h-10 h-8 "
              src={
                "https://ui-avatars.com/api/?background=random&name=" +
                email +
                "&length=1"
              }
              alt=""
            />
            <div
              className={`absolute ${
                openDropdown ? "block" : "hidden"
              }  absolute right-6 bg-slate-100 rounded-lg shadow-md mt-2 space-y-2 w-36 origin-top-right`}
            >
              <div
                onClick={() => {
                  setModal(true);
                  setOpenDropDown(false);
                }}
                className="px-4 py-2 cursor-pointer text-purple-600 "
              >
                Profile
              </div>
              <div
                onClick={() => {
                  navigate("/myblogs");
                }}
                className="px-4 py-2 cursor-pointer text-green-600 "
              >
                My Blogs
              </div>
              <div
                onClick={() => {
                  navigate("/createblog");
                }}
                className="px-4 py-2 cursor-pointer text-blue-600 "
              >
                Write Blog
              </div>
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/signin");
                }}
                className="px-4 py-2 cursor-pointer text-red-600"
              >
                Sign Out
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
