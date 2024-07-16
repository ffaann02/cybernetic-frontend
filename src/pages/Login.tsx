import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { ProgressSpinner } from "primereact/progressspinner";
import { object, string } from "yup";
import axiosInstance from "../api/axios";
import { useGoogleLogin } from "@react-oauth/google";
import useAxios from "../hooks/useAxios";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface LoginProps {
  username: string;
  password: string;
}

const loginValidationSchema = object({
  username: string()
    .min(8, "Username must be at least 8 characters")
    .max(20)
    .required("Please enter a username"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .max(30)
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,30}$/,
      "Password must include uppercase, lowercase, and numbers"
    )
    .required("Please enter a password"),
});

const Login = () => {
  const { axiosFetch } = useAxios();
  const { setItem } = useLocalStorage();
  const navigate = useNavigate();

  const [login, setLogin] = useState<LoginProps>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const handleSignIn = async () => {
    if (loading) return;
    try {
      await loginValidationSchema.validate(login, { abortEarly: false });
      setLoading(true);
      const response = await axiosFetch({
        axiosInstance,
        method: "post",
        url: "/auth/login",
        requestConfig: {
          username: login.username,
          password: login.password,
        },
      });
      checkCharacter(response.userId, response.email);
      setErrorMessages([]);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      if (err.response && err.response.status) {
        if (err.response.status === 400) {
          setErrorMessages(["Incorrect username or password"]);
        } else if (err.response.status === 500) {
          setErrorMessages(["An error occurred, please try again later"]);
        }
      } else {
        console.log(err.inner);
        setErrorMessages(err.inner.map((e: any) => e.message));
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log("Code Response:", codeResponse);
      try {
        const response = await axiosFetch({
          axiosInstance,
          method: "get",
          url: `/auth/google/login`,
          requestConfig: {
            params: { code: codeResponse.code },
          },
        });
        checkCharacter(response.userId, response.email);
      } catch (err: any) {
        if (err.response && err.response.status) {
          if (err.response.status === 400) {
            setErrorMessages([
              "This email is already registered, please use username and password to login",
            ]);
          } else if (err.response.status === 500) {
            setErrorMessages(["An error occurred, please try again later"]);
          }
        }
      }
    },
    flow: "auth-code",
  });

  const checkCharacter = async (userId: string, email: string) => {
    console.log(`userId: ${userId}, email: ${email}`);
    try {
      const response = await axiosFetch({
        axiosInstance,
        method: "get",
        url: `/user/character`,
        requestConfig: {
          params: { userId: userId },
        },
      });
      console.log(response.character);
      const data = {
        userId: userId,
        email: email,
        characterName: response.character.characterName,
      };
      setItem("CYBERNETIC_USER", data);
      navigate("/");
    } catch (err: any) {
      console.log(err);
      if (err.response && err.response.status) {
        if (err.response.status === 404) {
          const data = {
            userId: userId,
            email: email,
          };
          setItem("CYBERNETIC_USER", data);
          navigate("/create-character");
        } else if (err.response.status === 500) {
          setErrorMessages([
            "An error occurred, unable to access character data, please try again later",
          ]);
        }
      }
    }
  };

  return (
    <div className="w-full flex-grow flex flex-col max-h-screen py-16 2xl:py-24 bg-gradient-to-r from-blue-400 to-cyan-200">
      <div className="w-full h-full flex flex-grow max-w-6xl mx-auto">
        <div
          className="grid flex-grow grid-cols-12 border-t-2 border-t-cyan-400 rounded-xl
      bg-white/80 shadow-xl shadow-slate-200"
        >
          <div className="col-span-4 px-8 py-8 flex flex-col gap-y-4">
            <h1 className="text-2xl text-neutral-500 font-bold">Welcome to Cybernetic</h1>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                id="username"
                name="username"
                placeholder="Username"
                invalid={errorMessages.length > 0}
                value={login.username}
                onChange={handleChange}
                style={{ width: "100%" }}
                className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg
               text-slate-600 placeholder:text-slate-500 bg-white"
              />
            </div>

            <div className="p-inputgroup mt-2">
              <span className="p-inputgroup-addon">
                <RiLockPasswordLine />
              </span>
              <InputText
                id="password"
                name="password"
                placeholder="Password"
                invalid={errorMessages.length > 0}
                type="password"
                value={login.password}
                onChange={handleChange}
                className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg text-slate-600
               placeholder:text-slate-500 bg-white"
              />
            </div>
            <ul
              className={`${
                errorMessages.length > 0 ? "block" : "hidden"
              } ml-6 flex gap-y-2 flex-col`}
            >
              {errorMessages.map((error, index) => (
                <li key={index} className="text-red-400 text-sm list-disc">
                  {error}
                </li>
              ))}
            </ul>
            <Button
              className="font-ibm mt-2 text-left text-xl py-4 pr-6 hover:pr-3 transition-all duration-200 ease-linear"
              onClick={handleSignIn}
            >
              {!loading ? (
                <div className="flex justify-between w-full">
                  Sign In
                  <HiOutlineArrowRight className="text-2xl" />
                </div>
              ) : (
                <div className="flex justify-center w-full">
                  <div className="flex gap-x-2">
                    <ProgressSpinner
                      style={{ width: "24px", height: "24px" }}
                      strokeWidth="4"
                      fill="transparent"
                      animationDuration=".5s"
                      className=""
                    />
                    <p className="text-sm my-auto">Processing</p>
                  </div>
                </div>
              )}
            </Button>
            <p className="text-center text-slate-500">Or</p>
            <div className="justify-center flex">
              <Button
                className="bg-neutral-100 font-ibm pt-3 pb-2.5 w-fit
              border border-neutral-300 hover:bg-neutral-200 hover:border-neutral-400 transition-all 
              duration-200 ease-linear text-slate-500"
                onClick={() => console.log("Sign in with Google")}
              >
                <div
                  className="flex justify-center w-full gap-x-2 "
                  onClick={() => handleGoogleLogin()}
                >
                  <img
                    src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                    className="w-6 h-6"
                  />
                  <a className="my-auto">Sign in with Google</a>
                </div>
              </Button>
            </div>
            <div className="text-center text-blue-400 mt-2">
              Don't have an account?
              <Link
                to="/register"
                className="ml-2 hover:underline hover:text-blue-500 transition-all ease-linear duration-400"
              >
                Register
              </Link>
            </div>
            <div className="mt-auto text-center">
              <p>Cybernetic 2024.</p>
            </div>
          </div>
          <div className="col-span-8 w-full h-full relative">
            <img
              src="/images/login.png"
              className="absolute inset-0 object-cover w-full h-full rounded-r-xl"
              style={{ objectPosition: "right" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;