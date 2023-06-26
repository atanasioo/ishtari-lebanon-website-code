import { axiosServer } from "@/axiosServer";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import dynamic from "next/dynamic";
import { useContext, useRef, useState } from "react";

function Contact() {
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [err, setErr] = useState(false);
  const contactEmail = useRef("");
  const contactSubject = useRef("");
  const contactFirst = useRef("");
  const contactLast = useRef("");
  const contactMessage = useRef("");
  const contactPhone = useRef("");

  const HandlePhoneModel = dynamic(() => import("@/components/PhoneHanlder"), {
    ssr: false, // Disable server-side rendering
  });

  function submitForm(e) {
    e.preventDefault();
    setSubmitLoading(true);
    const email = contactEmail.current.value;
    const subject = contactSubject.current.value;
    const firstname = contactFirst.current.value;
    const lastname = contactLast.current.value;
    const message = contactMessage.current.value;
    const phone = contactPhone.current.value;
    const obj = JSON.stringify({
      email,
      subject,
      firstname,
      lastname,
      phone,
      message,
    });
    console.log(obj);
    axiosServer.post(buildLink("contactUs"), obj).then((response) => {
      const data = response.data;
      if (data.success) {
        console.log(data);
      }
      setSubmitLoading(false);
    });
  }

  const phoneHanlder = (childData, isValid) => {
    if (isValid === true) {
      contactPhone.current.value = childData;
      setErr("");
    } else {
      contactPhone.current.value = childData;
    }

    setIsValid(isValid);
  };

  return (
    <div className="bg-dinputBorder pb-2">
      <div className="w-full h-full md:w-1/2 relative md:px-5 md:block mx-auto py-10 ">
        <div className=" py-2.5 px-5 lg:py-7 md:px-12 bg-white min-h-full  rounded-sm">
          <div>
            <div className="block pb-2.5 text-d22 font-semibold text-center text-dborderblack2 m-2.5 uppercase">
              Contact Us
            </div>
            <div>
              <form onSubmit={(e) => submitForm(e)}>
                <input type="hidden" name="" />
                <div className="mt-3.5 relative flex items-center justify-between">
                  <div className="w-488">
                    <input
                      type="text"
                      name=""
                      required
                      ref={contactFirst}
                      className="border w-full border-dplaceHolder text-d16 text-dborderblack2 h-14 mb-2.5 px-5 outline-none rounded-sm"
                      placeholder="First name"
                    />
                    <div className={`error-name text-dred4 hidden`}></div>
                  </div>
                  <div className="w-488">
                    <input
                      type="text"
                      name=""
                      required
                      ref={contactLast}
                      className="border w-full  border-dplaceHolder text-d16 text-dborderblack2 h-14 mb-2.5 px-5 outline-none rounded-sm"
                      placeholder="Last name"
                    />
                    <div className={`error-name text-dred4 hidden`}></div>
                  </div>
                </div>
                <div className="mt-3.5 relative">
                  {/* <input
                      type="text"
                      name=""
                      className="border border-dgrey3 text-d16 w-full text-dborderblack2 h-14 mb-2.5 px-5 outline-none focus:border focus:border-dblack2"
                      placeholder="Phone number"
                    /> */}
                  <HandlePhoneModel
                    phone={contactPhone}
                    nb={""}
                    fromContact={true}
                    phoneHanlder={phoneHanlder}
                  />
                  <div className={`error-phone text-dred4 hidden`}></div>
                </div>
                <div className="mt-3.5 relative w-full">
                  <input
                    type="email"
                    name=""
                    required
                    ref={contactEmail}
                    className="border border-dplaceHolder text-d16 w-full text-dborderblack2 h-14 mb-2.5 px-5 outline-none rounded-sm"
                    placeholder="E-mail address"
                  />
                  <div className={`error-email text-dred4 hidden`}></div>
                </div>
                <div className="mt-3.5 relative">
                  <input
                    type="text"
                    name=""
                    required
                    ref={contactSubject}
                    className="border border-dplaceHolder text-d16 w-full text-dborderblack2 h-14 mb-2.5 px-5 outline-none rounded-sm"
                    placeholder="Subject"
                  />
                  <div className={`error-phone text-dred4 hidden`}></div>
                </div>
                <div className="mt-3.5 relative">
                  <textarea
                    type="text"
                    name=""
                    minLength={6}
                    rows="8"
                    required
                    ref={contactMessage}
                    className="border border-dplaceHolder text-d16 w-full text-dborderblack2  mb-2.5 pt-2.5 px-5 outline-none rounded-sm"
                    placeholder="Message"
                  />
                </div>

                <div className="sign-up  mt-3.5 relative">
                  <button
                    type="submit"
                    className="text-d16 font-mono bg-dblue3 h-14 block text-center 
                                        leading-3 w-full bg-clip-padding bg-dblue text-white uppercase rounded-sm"
                  >
                    {" "}
                    {submitLoading ? (
                      <span>LOADING...</span>
                    ) : (
                      <span>SUBMIT</span>
                    )}
                  </button>
                  {/* {signupError && (
                          <div className={`error-password text-dred4 mt-2 text-sm`}>{signupError}</div>
                        )} */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
