import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ReplySection } from "./ReplySection";
import CommentSkeleton from "./CommentSkeleton";

export default function CommentSection({ blogId }: { blogId: string }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replymode, setReplyMode] = useState(false);
  const [parentId, setParentId] = useState("");
  const [parentComment, setParentComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  useEffect(() => {
    axios
      .get(
        "https://backend.aman-lalwani208.workers.dev/api/v1/blog/comments/" +
          blogId,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(function (res) {
        setLoading(false);
        setComments(res.data.comments);
      })
      .catch(function (err) {
        console.log(err);
      });

    setInterval(() => {
      axios
        .get(
          "https://backend.aman-lalwani208.workers.dev/api/v1/blog/comments/" +
            blogId,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(function (res) {
          setComments(res.data.comments);
        })
        .catch(function (err) {
          console.log(err);
        });
    }, 1000000);
  }, [reload]);

  if (loading) {
    return (
      <>
        <CommentSkeleton></CommentSkeleton>
      </>
    );
  }

  if (replymode) {
    return (
      <>
        <ReplySection
          blogId={blogId}
          parentId={parentId}
          setReplyMode={setReplyMode}
          parentComment={parentComment}
        ></ReplySection>
      </>
    );
  }

  return (
    <>
      <div className="font-semibold mt-4 text-4xl">
        {comments.length} Comments
      </div>
      <div className="border border-slate-200 mt-4 mb-4 rounded p-4">
        <textarea
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          className="w-full border-2 rounded p-4 font-md text-lg focus:outline-none focus:border-sky-500 "
          rows={4}
          cols={30}
          placeholder="Add your comment"
          id=""
        ></textarea>
        <div className="flex flex-col ">
          <button
            type="button"
            className="self-end bg-black text-white p-2 rounded m-2 lg:m-4"
            onClick={async () => {
              const res = await axios.post(
                "https://backend.aman-lalwani208.workers.dev/api/v1/blog/comment/" +
                  blogId,
                {
                  comment: comment,
                  isChildComment: false,
                },
                {
                  headers: {
                    Authorization: localStorage.getItem("token"),
                  },
                }
              );

              if (res.status == 410) {
                toast.error("Something went wrong");
              } else {
                setReload((reload) => reload + 1);
                setComment("");
                toast.info("Comment Added");
              }
            }}
          >
            Comment
          </button>
          <div>
            {comments.map(
              (element: {
                id: string;
                comment: string;
                user: { email: string };
              }) => {
                return (
                  <div className="border-2 p-4 mt-2 mb-4 rounded w-full">
                    <div className="font-semibold text-lg">
                      {element.user.email}
                    </div>
                    <div className="mt-2 break-words">{element.comment}</div>
                    <div
                      className="cursor-pointer w-fit mt-2"
                      onClick={() => {
                        setReplyMode(true);
                        setParentId(element.id);
                        setParentComment(element.comment);
                      }}
                    >
                      <img
                        className="inline"
                        width="15"
                        height="15"
                        src="https://img.icons8.com/ios-glyphs/30/000000/reply-arrow.png"
                        alt="reply-arrow"
                      />{" "}
                      Reply
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    </>
  );
}
