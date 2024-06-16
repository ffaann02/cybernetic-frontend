import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { RiLockPasswordLine } from "react-icons/ri";

interface LoginProps {
  username: string;
  password: string;
}

const Login = () => {
  const [login, setLogin] = useState<LoginProps>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  return (
    <div className="w-full flex-grow flex flex-col max-h-screen p-24">
      <div className="grid flex-grow grid-cols-12 border rounded-xl w-full h-full">
        <div className="col-span-4 px-8 py-8 flex flex-col gap-y-6">
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
              className="w-full px-4 rounded-l-none py-3 rounded-lg border text-lg text-slate-600 placeholder:text-slate-500 bg-cyan-50"
            />
          </div>
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon">
              <RiLockPasswordLine/>
            </span>
            <InputText
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              value={login.password}
              onChange={handleChange}
              style={{ width: "100%" }}
              className="w-full px-4 rounded-l-none py-3 rounded-lg border text-lg text-slate-600 placeholder:text-slate-500 bg-cyan-50"
            />
          </div>
          <Button className="font-ibm text-left text-xl py-4">
            ลงชื่อเข้าสู่ระบบ
            <HiOutlineArrowRight className="text-2xl ml-auto inline" />
          </Button>
          <div className="text-center text-blue-400">
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
