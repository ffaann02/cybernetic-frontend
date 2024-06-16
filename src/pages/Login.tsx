import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";
import { ProgressSpinner } from "primereact/progressspinner";
import { object, string } from "yup";

interface LoginProps {
  username: string;
  password: string;
}

const Login = () => {
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

  const loginValidationSchema = object({
    username: string()
      .min(8, "ชื่อผู้ใช้ขั้นต่ำ 8 ตัวอักษร")
      .max(20)
      .required("กรุณากรอกชื่อผู้ใช้"),
    password: string()
      .min(8, "รหัสผ่านขั้นต่ำ 8 ตัวอักษร")
      .max(30)
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,30}$/,
        "รหัสผ่านต้องประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข"
      )
      .required("กรุณากรอกรหัสผ่าน"),
  });

  const handleSignIn = async () => {
    if (loading) return;
    try {
      await loginValidationSchema.validate(login, { abortEarly: false });
      console.log("password Correct");
      setErrorMessages([]);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    } catch (err: any) {
      console.log(err.inner);
      setErrorMessages(err.inner.map((e: any) => e.message));
    }
  };

  // console.log(errorMessages);

  return (
    <div className="w-full flex-grow flex flex-col max-h-screen p-24">
      <div className="grid flex-grow grid-cols-12 border rounded-xl w-full h-full">
        <div className="col-span-4 px-8 py-8 flex flex-col gap-y-4">
          <h1 className="text-2xl">ยินดีต้อนรับ</h1>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              id="username"
              name="username"
              placeholder="Username"
              value={login.username}
              onChange={handleChange}
              style={{ width: "100%" }}
              className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg text-slate-600 placeholder:text-slate-500 bg-cyan-50"
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
              aria-describedby="username-help"
              type="password"
              value={login.password}
              onChange={handleChange}
              className="font-ibm w-full px-4 rounded-l-none py-3 rounded-lg border text-lg text-slate-600 placeholder:text-slate-500 bg-cyan-50"
            />
          </div>
          <ul className={`${errorMessages.length>0 ? "block":"hidden"} ml-6 flex gap-y-2 flex-col`}>
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
                ลงชื่อเข้าสู่ระบบ
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
                  <p className="text-sm my-auto">กำลังประมวลผล</p>
                </div>
              </div>
            )}
          </Button>
          <p className="text-center text-slate-500">หรือ</p>
          <div className="justify-center flex">
            <Button
              className="bg-neutral-100 font-ibm pt-3 pb-2.5 w-fit
              border border-neutral-300 hover:bg-neutral-200 hover:border-neutral-400 transition-all 
              duration-200 ease-linear text-slate-500"
              onClick={() => console.log("Sign in with Google")}
            >
              <div className="flex justify-center w-full gap-x-2 ">
                <img
                  src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
                  className="w-6 h-6"
                />
                <a className="my-auto">ลงชื่อเข้าสู่ระบบด้วย Google</a>
              </div>
            </Button>
          </div>
          <div className="text-center text-blue-400 mt-2">
            ยังไม่มีบัญชีผู้ใช้ ?
            <Link
              to="/register"
              className="ml-2 hover:underline hover:text-blue-500 transition-all ease-linear duration-400"
            >
              สมัครสมาชิก
            </Link>
          </div>
          <div className="mt-auto text-center">
            <p>Cybernetic 2024.</p>
          </div>
        </div>
        <div className="col-span-8 w-full h-full relative">
          <img
            src="https://images.playground.com/427d12e318b644fbab30098ea303db8c.jpeg"
            className="absolute inset-0 object-cover w-full h-full rounded-r-xl"
          />
        </div>
      </div>
    </div>
  );
};
export default Login;
