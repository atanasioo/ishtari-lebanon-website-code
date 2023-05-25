import { useContext, useEffect, useState } from "react";
import { axiosServer } from "@/axiosServer";
// import { AccountContext } from "../contexts/AccountContext";
import buildLink from "@/urls";

function NotifyMe({ setShowNotify, showNotify, pname, pid }) {
//   const [state] = useContext(AccountContext);
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [error, setError] = useState();
  function handleSubmit(event) {
    event.preventDefault();
    const body = {
      product_id: pid,
      phone,
      email,
    };
    _axios
      .post(buildLink("notify", undefined, window.innerWidth), body)
      .then((data) => {
        if (data.data.success === true) {
          setShowNotify(false);
        } else {
          setError(data.data.message);
        }
      })
      .catch((err) => {
        setError(err.response.data.message);
      });
  }

  return (
    <div className={showNotify ? "relative" : "hidden"}>
      <div className="fixed w-screen min-h-screen bg-dblack top-0 left-0 z-50 bg-opacity-50 flex flex-col items-center justify-center">
        <div className="bg-white text-center text-dblack  w-96 rounded-lg p-8 pb-0 overflow-hidden relative">
          <p className="mb-4 text-dbase text-sm">{error}</p>
          <p className="text-xs">{pname}</p>
          <span
            onClick={() => setShowNotify(false)}
            className=" z-10 absolute top-0 right-0 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-dgrey"
          >
            <i className="icon icon-cancel text-2xl"></i>
          </span>

          <h2 className={`text-lg font-light mt-6`}>
            Enter your number to get notify when the product restock
          </h2>
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="my-4">
              <div className="input">
                <label>Email</label>
                <input
                  placeholder="john@example.com"
                  type="email"
                  // required="true"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input mt-4">
                <label>Phone</label>
                <input
                  placeholder="+961 3 123456"
                  type="tel"
                  required="true"
                  autoComplete="phone"
                  minLength="6"
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <button className="text-dblue py-4  block text-center -mx-8 w-96 mt-6 hover:bg-dblue hover:text-white">
              <span>SUBMIT</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NotifyMe;
