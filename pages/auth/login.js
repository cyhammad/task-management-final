import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";

const Login = () => {
  const router = useRouter();
  const { user, login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errAlert, setErrAlert] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const handleLogin = async (e) => {
    if (loading) return;
    setLoading(true);
    e.preventDefault();
    const q = query(collection(db, "users"), where("email", "==", data.email));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      if (doc.data().superuser) {
        try {
          await login(data.email, data.password);
          Router.push("/");
        } catch (error) {
          setErrAlert("Invalid Credentials")
        }
      } else {
        setErrAlert("User is not admin");
      }
    });
    setLoading(false);
  };
  return (
    <>
      <div className="bg-default h-screen">
        <Head>
          <title>Log In</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="grid grid-cols-12 h-screen">
          <div className="col-span-1 lg:col-span-3"></div>
          <div className="col-span-10 lg:col-span-5 flex flex-col items-center lg:px-10">
            <div className="relative w-36 h-24 mb-10 cursor-pointer mt-5">
              <Image
                src="https://firebasestorage.googleapis.com/v0/b/taskmanagement-a5d8a.appspot.com/o/LOGO.PNG?alt=media&token=4357c703-28fd-476b-b998-0525088436c0"
                layout="fill"
                alt="Profile"
                objectFit="contain"
              />
            </div>
            <p className="text-3xl font-bold pb-3 w-full text-center">
              Welcome Mrs. Donshay
            </p>
            <p className="text-gray-500">Login to continue using</p>
            <div className="pt-5 sm:px-10 w-full max-w-lg">
              <form onSubmit={handleLogin} method="POST">
                <div className="shadow-md flex justify-center items-center p-5 bg-white rounded mb-7">
                  <EnvelopeIcon className="w-6 h-6 text-gray-500" />
                  <input
                    value={data.email}
                    className="focus:outline-none pl-4 w-full"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                  />
                </div>
                <div className="shadow-md flex justify-center items-center p-5 bg-white rounded">
                  <LockClosedIcon className="w-6 h-6 text-gray-500" />
                  <input
                    value={data.password}
                    className="focus:outline-none pl-4 w-full"
                    type={showPass ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={(e) =>
                      setData({ ...data, password: e.target.value })
                    }
                  />
                  {showPass ? (
                    <EyeIcon
                      className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
                      onClick={() => setShowPass(false)}
                    />
                  ) : (
                    <EyeSlashIcon
                      className="w-6 h-6 text-gray-500 hover:text-black cursor-pointer"
                      onClick={() => setShowPass(true)}
                    />
                  )}
                </div>

                <Link href="#">
                  <p className="text-end w-full text-sm text-gray-500 mt-2 hover:text-black cursor-pointer">
                    Forgot Password?
                  </p>
                </Link>
                {errAlert != "" ? (
                  <>
                    <div className="bg-red-400 text-white mt-2 self-center px-3 rounded text-xs py-2 flex justify-between">
                      <p>{errAlert}</p>
                      <XCircleIcon
                        className="w-5 h-5"
                        onClick={() => setErrAlert("")}
                      />
                    </div>
                  </>
                ) : null}
                <input
                  className="shadow-md flex justify-center items-center p-5 bg-[#004064] rounded mt-7 cursor-pointer text-white w-full"
                  type="submit"
                  value={loading ? "Logging in..." : "Log In"}
                />
              </form>
            </div>
          </div>
          <div className="col-span-4 flex-col justify-center items-end h-full w-full hidden lg:flex">
            <div className="h-[48vh] aspect-square rounded-tl-full bg-[#81B3FF] flex justify-end items-end">
              <div className="h-[38vh] aspect-square rounded-tl-full bg-[#76ACFF] flex justify-end items-end">
                <div className="h-[28vh] aspect-square rounded-tl-full bg-[#65A3FF] flex justify-end items-end">
                  <div className="h-[18vh] aspect-square rounded-tl-full bg-[#5A9CFF] flex justify-end items-end"></div>
                </div>
              </div>
            </div>
            <div className="h-[48vh] aspect-square rounded-bl-full bg-[#81B3FF] flex justify-end items-start">
              <div className="h-[38vh] aspect-square rounded-bl-full bg-[#76ACFF] flex justify-end items-start">
                <div className="h-[28vh] aspect-square rounded-bl-full bg-[#65A3FF] flex justify-end items-start">
                  <div className="h-[18vh] aspect-square rounded-bl-full bg-[#5A9CFF] flex justify-end items-start"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
