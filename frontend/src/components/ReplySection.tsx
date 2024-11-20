import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CommentSkeleton from "./CommentSkeleton";

export function ReplySection({
  parentComment,
  blogId,
  parentId,
  setReplyMode,
}: {
  parentComment: string;
  blogId: string;
  parentId: string;
  setReplyMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [reload, setReload] = useState(0);
  const [replies, setReplies] = useState([]);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(
        "https://backend.aman-lalwani208.workers.dev/api/v1/blog/replies/" +
          parentId,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      )
      .then(function (res) {
        setReplies(res.data.replies);
        setLoading(false);
      })
      .catch(function (err) {
        console.log(err);
      });

    setInterval(() => {
      axios
        .get(
          "https://backend.aman-lalwani208.workers.dev/api/v1/blog/replies/" +
            parentId,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        )
        .then(function (res) {
          setReplies(res.data.comments);
        })
        .catch(function (err) {
          console.log(err);
        });
    }, 1000000);
  }, [reload]);

  if (loading) {
    return <CommentSkeleton></CommentSkeleton>;
  }

  return (
    <>
      <div
        className="flex items-center gap-1 cursor-pointer mt-4"
        onClick={() => setReplyMode(false)}
      >
        <img
          width="14"
          height="14 "
          src="https://img.icons8.com/metro/26/back.png"
          alt="back"
        />
        <div className="text-xl font-bold ">Go Back</div>
      </div>

      <div className="font-semibold mt-4 text-4xl">
        {replies.length} Replies
      </div>

      <div className="border border-slate-200 mt-4 mb-4 rounded p-4">
        <div className="font-bold text-2xl ml-4 ">{parentComment}</div>
        <textarea
          value={reply}
          onChange={(e) => {
            setReply(e.target.value);
          }}
          className="w-full border-2 rounded p-4 font-md text-lg focus:outline-none focus:border-sky-500 "
          rows={4}
          cols={30}
          placeholder="Add your reply"
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
                  reply: reply,
                  parentId,
                  isChildComment: true,
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
                setReply("");
                toast.info("Reply Added");
              }
            }}
          >
            Reply
          </button>
          <div>
            {replies.map(
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
