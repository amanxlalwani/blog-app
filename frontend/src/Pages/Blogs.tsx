import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import axios from "axios";

import Nav from "../components/Nav";

import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import useSigned from "../hooks/useSigned";
import BlogSkeleton from "../components/BlogCardSkeleton";
import { useProfile } from "../hooks/useProfile";


export default function Blogs() {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const { modal, setModal } = useProfile();
  const [loading, setLoading] = useState(true);
  const { isSigned, isLoading, email } = useSigned();
  const [tab, setTab] = useState("explore");
  const [isBlur, setIsBlur] = useState(false);

  const [totalPages, setTotalPages] = useState(1);

  const limit = 8;
  const navigate = useNavigate();
  const location = useLocation();
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
    console.log(location);
    axios
      .get(
        `https://backend.aman-lalwani208.workers.dev/api/v1/blog/${tab}/bulk?page=${
          searchParams.get("page") || 1
        }&limit=${limit}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(function (res) {
        setLoading(false);
        setTotalPages(res.data.totalPages);
        setBlogs(res.data.blogs);
        searchParams.set("page", res.data.currentPage);
      })
      .catch(function (err) {
        console.log(err);
      });

    setInterval(() => {
      axios
        .get(
          `https://backend.aman-lalwani208.workers.dev/api/v1/blog/${tab}/bulk`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(function (res) {
          setTotalPages(res.data.totalPages);
          setBlogs(res.data.blogs);
        })
        .catch(function (err) {
          console.log(err);
        });
    }, 1000000);
  }, [tab, location.search]);

  if (isLoading || loading) {
    return (
      <>
        <Nav
          setIsBlur={setIsBlur}
          email={email}
          modal={modal}
          setModal={setModal}
        ></Nav>
        <div
          onClick={() => {
            setModal(false);
          }}
          className={modal ? "blur-sm  select-none" : ""}
        >
          <div className="lg:w-1/2 max-w-full lg:m-auto lg:mt-24 px-4 mb-8">
            <BlogSkeleton></BlogSkeleton>
            <BlogSkeleton></BlogSkeleton>
            <BlogSkeleton></BlogSkeleton>
            <BlogSkeleton></BlogSkeleton>
          </div>
        </div>
      </>
    );
  }

  if (!isSigned) {
    navigate("/signin");
  }

  return (
    <>
      <Nav
        setIsBlur={setIsBlur}
        email={email}
        modal={modal}
        setModal={setModal}
      ></Nav>
      <div
        onClick={() => {
          setModal(false);
        }}
        className={modal || isBlur ? "blur-sm select-none" : ""}
      >
        <div className="lg:w-1/2 max-w-full lg:m-auto lg:mt-24 mt-12 px-4 pb-8 ">
          <div className="flex justify-between p-4 pb-4 text-gray-500 font-light border-b">
            <div
              onClick={() => {
                if (tab != "explore") {
                  setLoading(true);
                  setTab("explore");
                }
              }}
              className={`${
                tab == "explore" ? "text-black font-semibold borber-b b" : ""
              } cursor-pointer`}
            >
              Explore
            </div>
            <div
              onClick={() => {
                if (tab != "subscriptions") {
                  setLoading(true);
                  setTab("subscriptions");
                }
              }}
              className={`${
                tab == "subscriptions" ? "text-black font-semibold" : ""
              } cursor-pointer`}
            >
              Subscriptions
            </div>
          </div>
          {blogs.map(
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

          {tab == "subscriptions" && blogs.length == 0 ? (
            <>
              <div className="text-xl mt-12 text-center">
                You have no subscriptions currently.
              </div>
            </>
          ) : null}
          {blogs.length > 0 ? (
            <>
              <div className="w-full flex justify-center mt-20">
                <nav aria-label="Page navigation example">
                  <ul className="inline-flex -space-x-px text-base h-10">
                    {parseInt(searchParams.get("page") || "-1") - 3 > 0 ? (
                      <li>
                        <a
                          onClick={() => {
                            if (
                              parseInt(searchParams.get("page") || "-1") - 3 >
                              0
                            ) {
                              setLoading(true);
                              navigate(
                                `/blogs?page=${
                                  parseInt(searchParams.get("page") || "0") - 3
                                }`,
                                { replace: true }
                              );
                            }
                          }}
                          className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                          Previous
                        </a>
                      </li>
                    ) : null}

                    {parseInt(searchParams.get("page") || "-1") - 2 > 0 ? (
                      <li>
                        <a
                          onClick={() => {
                            setLoading(true);
                            navigate(
                              `/blogs?page=${
                                parseInt(searchParams.get("page") || "0") - 2
                              }`,
                              { replace: true }
                            );
                          }}
                          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                          {parseInt(searchParams.get("page") || "0") - 2}
                        </a>
                      </li>
                    ) : null}

                    {parseInt(searchParams.get("page") || "-1") - 1 > 0 ? (
                      <li>
                        <a
                          onClick={() => {
                            setLoading(true);
                            navigate(
                              `/blogs?page=${
                                parseInt(searchParams.get("page") || "0") - 1
                              }`,
                              { replace: true }
                            );
                          }}
                          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                          {parseInt(searchParams.get("page") || "0") - 1}
                        </a>
                      </li>
                    ) : null}
                    <li>
                      <a className="flex items-center justify-center px-4 h-10 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
                        {searchParams.get("page")}
                      </a>
                    </li>

                    {parseInt(
                      searchParams.get("page") || totalPages.toString()
                    ) +
                      1 <=
                    totalPages ? (
                      <li>
                        <a
                          onClick={() => {
                            setLoading(true);
                            navigate(
                              `/blogs?page=${
                                parseInt(searchParams.get("page") || "0") + 1
                              }`,
                              { replace: true }
                            );
                          }}
                          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                          {parseInt(searchParams.get("page") || "0") + 1}
                        </a>
                      </li>
                    ) : null}

                    {parseInt(
                      searchParams.get("page") || totalPages.toString()
                    ) +
                      2 <=
                    totalPages ? (
                      <li>
                        <a
                          onClick={() => {
                            setLoading(true);
                            navigate(
                              `/blogs?page=${
                                parseInt(searchParams.get("page") || "0") + 2
                              }`,
                              { replace: true }
                            );
                          }}
                          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                        >
                          {parseInt(searchParams.get("page") || "0") + 2}
                        </a>
                      </li>
                    ) : null}

                    {parseInt(
                      searchParams.get("page") || totalPages.toString()
                    ) +
                      3 <=
                    totalPages ? (
                      <li>
                        <a
                          onClick={() => {
                            setLoading(true);
                            navigate(
                              `/blogs?page=${
                                parseInt(searchParams.get("page") || "0") + 3
                              }`,
                              { replace: true }
                            );
                          }}
                          className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
                        >
                          Next
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </nav>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
