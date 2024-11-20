import { useEffect, useState } from "react";
import BlogCard from "../components/BlogCard";
import axios from "axios";

import Nav from "../components/Nav";

import { useNavigate } from "react-router-dom";
import useSigned from "../hooks/useSigned";
import BlogSkeleton from "../components/BlogCardSkeleton";
import { useProfile } from "../hooks/useProfile";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const { modal, setModal } = useProfile();
  const [loading, setLoading] = useState(true);
  const { isSigned, isLoading, email } = useSigned();
  const [tab, setTab] = useState("explore");
  const [isBlur, setIsBlur] = useState(false);
  const navigate = useNavigate();

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
        setLoading(false);
        setBlogs(res.data.blogs);
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
          setBlogs(res.data.blogs);
        })
        .catch(function (err) {
          console.log(err);
        });
    }, 1000000);
  }, [tab]);

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
        </div>
      </div>
    </>
  );
}
