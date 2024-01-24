import React, { useState } from 'react'
import Loader from '../Loader';

const AccountCard = ({email,password,onclick}) => {
const [loading,setLoading] = useState(false);
function login(){
    setLoading(true);
    onclick(email,password)
}
const color = {
    a: "#FFEBCD	",
    b: "#00BFFF",
    c: "#00BFFF",
    d: "#00BFFF",
    e: "#DC143C",
    f: "#bf1b26",
    g: "#008000",
    h: "#008000",
    i: "#008000",
    j: "#008000",
    k: "#008000",
    l: "#008000",
    m: "#008000",
    n: "#008000",
    o: "#F08080	",
    p: "#bf1b26",
    q: "#bf1b26",
    r: "#DC143C",
    t: "#FFD700",
    u: "#bf1b26",
    v: "#bf1b26",
    w: "#bf1b26",
    x: "#bf1b26",
    y: "#00BFFF",
    z: "#00BFFF",
    s: "#DC143C",
  };

  const textColor = {
    a: "#FFEBCD	",
    b: "#00BFFF",
    c: "#00BFFF",
    d: "#00BFFF",
    e: "#DC143C",
    f: "#bf1b26",
    g: "#008000",
    h: "#008000",
    i: "#008000",
    j: "#008000",
    k: "#008000",
    l: "#008000",
    m: "#008000",
    n: "#008000",
    o: "#F08080	",
    p: "#bf1b26",
    q: "#bf1b26",
    r: "#DC143C",
    t: "#FFD700",
    u: "#bf1b26",
    v: "#bf1b26",
    w: "#bf1b26",
    x: "#bf1b26",
    y: "#00BFFF",
    z: "#00BFFF",
    s: "#00BFFF",
  };

  return (
    <div onClick={()=>{login()}} className=" cursor-pointer hover:bg-dplaceHolder flex flex-row  justify-between  px-2 py-2 rounded-md border border-dplaceHolder  ">
   <div className=' flex flex-row gap-3 justify-start'>
    <div className=" h-fit my-auto" >  <div
                        className="flex rounded-full w-6 h-6 text-white   text-d14 items-center justify-center disable"
                        style={{
                          backgroundColor:
                            color[
                              email
                                .replace(/\s+/g, "")
                                .charAt(0)
                                .toLowerCase()
                            ],
                          color:
                            textColor[
                              email
                                .replace(/\s+/g, "")
                                .charAt(0)
                                .toLowerCase()
                            ],
                        }}
                      >
                        {" "}
                        {email
                          .replace(/\s+/g, "")
                          .charAt(0)
                          .toUpperCase()}
                      </div></div>
     <span>{email}</span>
     </div>
     {loading&&<div className=' w-7 h-7 relative my-auto'><Loader/></div>}
     </div>
  )
}

export default AccountCard