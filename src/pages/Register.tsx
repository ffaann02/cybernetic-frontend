import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { ProgressSpinner } from "primereact/progressspinner";
import { object, string, ref } from "yup";
import { useGoogleLogin } from "@react-oauth/google";
import axiosInstance from "../api/axios";
import useAxios from "../hooks/useAxios";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface RegisterProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerValidationSchema = object({
  username: string()
    .min(8, "ชื่อผู้ใช้ขั้นต่ำ 8 ตัวอักษร")
    .max(20)
    .required("กรุณากรอกชื่อผู้ใช้"),
  email: string().email("รูปแบบอีเมลไม่ถูกต้อง").required("กรุณากรอกอีเมล"),
  password: string()
    .min(8, "รหัสผ่านขั้นต่ำ 8 ตัวอักษร")
    .max(30)
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,30}$/,
      "รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข"
    )
    .required("กรุณากรอกรหัสผ่าน"),
  confirmPassword: string()
    .oneOf([ref("password")], "รหัสผ่านไม่ตรงกัน")
    .required("กรุณายืนยันรหัสผ่าน"),
});

const Register = () => {
  const { axiosFetch } = useAxios();
  const { setItem } = useLocalStorage();
  const navigate = useNavigate();

  const [register, setRegister] = useState<RegisterProps>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegister({ ...register, [name]: value });
  };

  const handleRegister = async () => {
    if (loading) return;
    try {
      await registerValidationSchema.validate(register, { abortEarly: false });
      setLoading(true);
      const response = await axiosFetch({
        axiosInstance,
        method: "post",
        url: "/auth/signup",
        requestConfig: {
          email: register.email,
          username: register.username,
          password: register.password,
        },
      });
      checkCharacter(response.userId, response.email);
      setErrorMessages([]);
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      setLoading(false);
      if (err.response && err.response.status) {
        if (
          err.response.status === 400 &&
          err.response.data.conflict === "email"
        ) {
          setErrorMessages(["อีเมลนี้ถูกใช้งานแล้ว"]);
        } else if (
          err.response.status === 400 &&
          err.response.data.conflict === "username"
        ) {
          setErrorMessages(["ชื่อผู้ใช้นี้ถูกใช้งานแล้ว"]);
        } else if (err.response.status === 500) {
          setErrorMessages(["เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง"]);
        }
      }
      // Error occurred by validation
      else {
        setLoading(false);
        console.log(err.inner);
        setErrorMessages(err.inner.map((e: any) => e.message));
      }
    }
  };

  const handleGoogleSignUp = useGoogleLogin({
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
        setErrorMessages([]);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        if (err.response && err.response.status) {
          if (err.response.status === 400) {
            setErrorMessages(["อีเมลดังกล่าวได้ลงทะเบียนไว้แล้ว กรุณาใช้ username และ password เข้าสู่ระบบ"]);
          } else if (err.response.status === 500) {
            setErrorMessages(["เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง"]);
          }
        }
      }
    },
    flow: "auth-code",
  });

  const checkCharacter = async (userId: string, email: string) => {
    try {
      const response = await axiosFetch({
        axiosInstance,
        method: "get",
        url: `/character/info`,
        requestConfig: {
          params: { userId: userId },
        },
      });
      console.log(response.character)
      const data = {
        userId: userId,
        email: email,
        characterName: response.character.characterName
      }
      setItem("CYBERNETIC_USER", data);
      navigate("/");
    } catch (err: any) {
      console.log(err);
      if (err.response && err.response.status) {
        if (err.response.status === 404) {
          const data = {
            userId: userId,
            email: email,
          }
          setItem("CYBERNETIC_USER", data);
          navigate("/create-character");
        } else if (err.response.status === 500) {
          setErrorMessages(["เกิดข้อผิดพลาดบางอย่าง ไม่สามารถเข้าถึงข้อมูลตัวละครได้ กรุณาลองใหม่อีกครั้ง"]); 
        }
      }
    }
  }


  return (
    <div className="w-full flex-grow flex flex-col min-h-screen py-16 2xl:py-14 bg-gradient-to-r from-cyan-400 to-blue-400">
      <div
        className="grid flex-grow max-w-5xl mx-auto grid-cols-12 border-t-2 border-t-cyan-400 rounded-xl w-full h-full
         bg-white/80 shadow-xl shadow-slate-200"
      >
        <div className="col-span-8 px-14 pt-10 pb-12 flex flex-col gap-y-4">
          <h1 className="text-2xl">สมัครสมาชิก</h1>
          <div className="flex flex-col gap-4">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                id="username"
                name="username"
                placeholder="Username"
                invalid={errorMessages.length > 0}
                value={register.username}
                onChange={handleChange}
                style={{ width: "100%" }}
                className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg
                  text-slate-600 placeholder:text-slate-500 bg-white"
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
              </span>
              <InputText
                id="email"
                name="email"
                placeholder="Email"
                invalid={errorMessages.length > 0}
                value={register.email}
                onChange={handleChange}
                className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg 
                  text-slate-600 placeholder:text-slate-500 bg-white"
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <RiLockPasswordLine />
              </span>
              <InputText
                id="password"
                name="password"
                placeholder="Password"
                invalid={errorMessages.length > 0}
                type="password"
                value={register.password}
                onChange={handleChange}
                className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg 
                  text-slate-600 placeholder:text-slate-500 bg-white"
              />
            </div>
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon">
                <RiLockPasswordLine />
              </span>
              <InputText
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                invalid={errorMessages.length > 0}
                type="password"
                value={register.confirmPassword}
                onChange={handleChange}
                className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg 
                  text-slate-600 placeholder:text-slate-500 bg-white"
              />
            </div>
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
            className="h-fit font-ibm text-left text-xl py-4 pr-6 hover:pr-3 transition-all 
                duration-200 ease-linear w-1/2"
            onClick={handleRegister}
          >
            {!loading ? (
              <div className="flex justify-between w-full">
                ลงทะเบียน
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
                  />
                  <p className="text-sm my-auto">กำลังประมวลผล</p>
                </div>
              </div>
            )}
          </Button>
          <div className="">
            <Button
              className="bg-neutral-100 font-ibm px-4 w-fit border border-neutral-300 
                    hover:bg-neutral-200 hover:border-neutral-400 transition-all duration-200 
                    ease-linear text-slate-500"
              onClick={() => handleGoogleSignUp()}
            >
              <div className="flex justify-center w-full gap-x-1">
                <img
                  src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                  className="w-6 h-6"
                />
                <a className="my-auto text-xs">ลงชื่อเข้าสู่ระบบด้วย Google</a>
              </div>
            </Button>
            <div className="text-blue-400 mt-4">
              มีบัญชีผู้ใช้แล้ว ?
              <Link
                to="/login"
                className="ml-2 hover:underline hover:text-blue-500 transition-all ease-linear duration-400"
              >
                ลงชื่อเข้าสู่ระบบ
              </Link>
            </div>
          </div>
          <div className="mt-auto text-center">
            <p>Cybernetic 2024.</p>
          </div>
        </div>
        <div className="col-span-4 w-full h-full relative">
          <img
            src="https://lsvp.com/wp-content/uploads/2023/07/ai-inworld-cover.jpg"
            className="absolute inset-0 object-cover w-full h-full rounded-r-xl"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
