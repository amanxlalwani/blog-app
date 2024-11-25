import { useState } from "react";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { signupType } from "@amanxlalwani/blog-app-common";
import useSigned from "../hooks/useSigned";
import Loading from "../components/Loading";

export default function Signup() {
  const [user, setUser] = useState<signupType>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { isSigned, isLoading } = useSigned();
  if (isLoading || loading) {
    return (
      <>
        <Loading></Loading>
      </>
    );
  }

  if (isSigned) {
    navigate("/blogs");
  }

  async function apiCall(user: signupType) {
    setLoading(true);
    try {
      const res = await axios.post(
        "https://backend.aman-lalwani208.workers.dev/api/v1/user/signup",
        user
      );

      const token = res.data.token;
      localStorage.setItem("token", token);
      setLoading(false);
      toast.success("Signed Up!");
      navigate("/blogs");
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      const message = err.response.data["message"];
      toast.error(message);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:gap-4 lg:grid-cols-2 place-content-center content-stretch h-full">
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-center text-3xl md:text-4xl font-bold">
              {" "}
              Create an account{" "}
            </h1>
            <div className="text-gray-400 text-md md:text-lg mb-6 mt-2 font-semibold">
              {" "}
              Already have an account?{" "}
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  navigate("/signin");
                }}
              >
                Login
              </span>{" "}
            </div>
          </div>
          <div className="w-3/6">
            <InputBox
              name="Name"
              placeholder="Enter your name"
              type="text"
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            ></InputBox>
            <InputBox 
              required={true}
              name="Username"
              placeholder="example_username"
              type="text"
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            ></InputBox>
            <InputBox
              required={true}
              name="Password"
              placeholder=""
              type="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            ></InputBox>
            <Button
              onClick={async () => {
                await apiCall(user);
              }}
              title="Sign Up"
            ></Button>
          </div>
        </div>

        <div className="bg-gray-100 h-full lg:flex flex-col justify-center items-center hidden ">
          <div className="w-7/12  flex flex-col justify-between items-center gap-4 hidden lg:block">
            <div className="font-bold text-4xl">
              "The customer service I received was exceptional. The support team
              went above and beyond to address my concerns."
            </div>
            <div className="self-start">
              <div className="font-bold text-xl">Jules Winnfield</div>
              <div className="text-gray-400 text-lg">CEO,Acme Inc</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
