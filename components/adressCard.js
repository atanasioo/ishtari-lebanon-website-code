import React, { useRef, useState } from 'react'
import Link from "next/link";
import { FaSms } from 'react-icons/fa';
import buildLink from '@/urls';
import { axiosServer } from '@/axiosServer';
import Loader from './Loader';
import { useMessage } from '@/contexts/MessageContext';
const AdressCard = ({getAdress, address,deleteAddress}) => {
    const [openModal ,setOpenModal]= useState(false)
    const [codeSection,setCodeSection] = useState(false);
       
    const [loadingVerify,setLoadingVerify] = useState(false)
    let verificationCode =['', '', '', '','',''];
    const [validateCodeConst,setValidateCodeConst] = useState(0);
    const verificationCodeRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];
let isPast = false;
  const { setGlobalMessage, setSuccessMessage, setErrorMessage } = useMessage();
  
  
    let code = ''
    const path = "";


   async function verifyPhone(){
    const obj ={
        address_id:address.address_id
    }
    setLoadingVerify(true)
    await axiosServer.post(buildLink("verify"),obj).then((res)=>{
        if(res.data.success){
            setCodeSection(true);
            code = res.data.code
            verificationCodeRefs[0].current.focus();
           setLoadingVerify(false)
        }
    })
    }


    const handlePasteCode = (e) => {
       
      isPast = true;
      const pastedCode = e.clipboardData.getData('text/plain');
      console.log(pastedCode)
      
      // Validate that the pasted code is numeric and has the correct length
      if (/^\d{6}$/.test(pastedCode)) {
        const newVerificationCode = pastedCode.split('').slice(0, verificationCode.length);
        verificationCodeRefs.map((item,index)=>
        item.current.value = newVerificationCode[index]
        )
       handleVerifyCode()
      }
    };
  

 
    const handleVerifyCode = async() => {

      verificationCodeRefs.map((item,index)=>
      verificationCode[index] = item.current.value
      )

      const code = verificationCode.join('');

      if(code.toString().length === 6){
          const obj ={
              address_id:address.address_id,
              verification_code:code
          }
          setLoadingVerify(true)
          
          await axiosServer.post(buildLink("verify"),obj).then((res)=>{
              setLoadingVerify(false)
              
              if(res.data.success){
                  setCodeSection(false);
                  setOpenModal(false)
                  setGlobalMessage(res.data.message)
                  setSuccessMessage(true)
                  getAdress()
                  setTimeout(() => {
                    setGlobalMessage('')
                    setSuccessMessage(false)
                  }, 3000);
                
                 
              }else{
                setGlobalMessage(res.data.message)
                setErrorMessage(true)
                setTimeout(() => {
                  setGlobalMessage('')
                  setErrorMessage(false)
                }, 3000);
              }
          })
      }
    };
    
      const handleCodeChange = (index, value) => {
      

       if(!isPast){

       
        verificationCodeRefs[index].current.value = value ;
        if (value !== '' && index < verificationCode.length - 1) {
          verificationCodeRefs[index + 1].current.focus();
        
        }
            handleVerifyCode()
      

      
       }
    
        // Move focus to the next input field
      
      
      };

  return (
    <div
    className="p-8 mobile:flex mobile:justify-between bg-white mt-10"
    key={address.address_id}
  >
    <div className="  w-full">
      <div className="flex gap-4 mb-5">
        <div className="text-d18 capitalize pr-bold ">
          {address.zone}
        </div>
      </div>
      <div className="">
        <div className="flex ">
          <span className="lg:w-28 text-dgreyAddress">
            First Name:
          </span>
          <div>{address.firstname}</div>
        </div>
        <div className="flex mt-3 ">
          <span className="lg:w-28 text-dgreyAddress">
            Last Name:
          </span>
          <div>{address.lastname}</div>
        </div>
        <div className="flex mt-3 ">
          <span className="lg:w-28 text-dgreyAddress">
            Address:
          </span>
          <div>{address.address_1}</div>
        </div>
        <div className="  flex justify-between  w-full flex-row  ">
          <div className="flex mt-3">
          <span className="lg:w-28 text-dgreyAddress">
            Telephone:
          </span>
          <div className={`${address.verified?"text-dgreen":"text-dbase"}`}>{ address.telephone}</div>
          </div>
         { !address.verified&& <button onClick={()=>setOpenModal(true)} className=" border border-dblue text-dblue  hover:bg-dblue bg-white hover:text-white transition-all px-4">Verify</button>
}
        </div>
        {window.config["useTown"] && (
          <div className="flex mt-3">
            <span className="lg:w-28 text-dgreyAddress">
              Town:{" "}
            </span>
            <div className="font-semibold">
              {address.town_name}
            </div>
          </div>
        )}
        <div className="mobile:hidden border-t border-dgreyZoom mt-6 pt-4 flex gap-6">
          <button
            className="text-dgreyAddress underline cursor-pointer"
            onClick={() => deleteAddress(address?.address_id)}
          >
            Delete
          </button>
          <Link
            href={`${path}/account/address/${address.address_id}/edit`}
            className="text-dgreyAddress underline cursor-pointer"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
    <div className="hidden mobile:block">
      <div className="flex items-center gap-6">
        <button
          className="text-dgreyAddress underline cursor-pointer"
          onClick={() => deleteAddress(address?.address_id)}
        >
          Delete
        </button>
        <Link
          href={`${path}/account/address/${address.address_id}/edit`}
          className="text-dgreyAddress underline cursor-pointer"
        >
          Edit
        </Link>
      </div>
    </div>

    {openModal&&<div onClick={()=>setOpenModal(false)} className=" fixed left-0 top-0 right-0 bottom-0  bg-dblack bg-opacity-40 z-50 "></div>}
<div className={`${openModal?" top-0  overflow-hidden scale-100 opacity-100":" -top-32 scale-0 opacity-0"} z-50 fixed px-5   rounded-md max-md:w-[350px] max-md:h-[350px] left-0 top-0 bottom-0 py-5 right-0  transition-opacity duration-300 bg-white my-auto mx-auto w-[450px] h-[350px]`}>
<div className=' w-full relative'>
<div className=" w-fit py-4 mx-auto">
  <FaSms className=" text-[70px] text-dblue"/>
</div>
<div className={` ${codeSection ?"right-[500px]":"right-0"} absolute transition-all `}>
  <div className="  w-full h-full relative justify-center text-center flex flex-col gap-4">
 
<div className=" mx-auto"> 
<h2 className=' font-bold text-2xl'>Send Verification Code</h2>

<span className=' mt-4'>Are you sure you want to verify the number {address.telephone}</span>
<button onClick={()=>{verifyPhone()}} className=' mt-8 w-full border border-dblue rounded-md text-dblue py-3 bg-white hover:bg-dblue flex flex-row justify-center gap-5 hover:text-white transition-all '> <span>Send{" "}</span> { loadingVerify&& <div className=' w-6 h-6'><Loader/></div>}</button>
  </div>
</div>
</div>


<div className={` ${codeSection ?"left-0":"left-[500px]"} absolute  w-full h-full transition-all `}>
  <div className=" flex justify-center text-center">
  
<div className=" my-auto w-full  mx-auto"> 
<h2 className=' font-bold text-2xl'>Phone Number Validation</h2>

<span className=' mt-4'>Enter the code sent to  {address.telephone}</span>
<div className=' w-fit mx-auto gap-2  mt-5 flex flex-row' >
       
        {verificationCode.map((digit, index) => (
          <input
          className=' w-10 py-2 text-center bg-dgrey rounded-md border-b border-dblue'
            key={index}
            type="text"
            maxLength="1"
    
            onChange={(e) =>{
              handleCodeChange(index, e.target.value)
            } }
            onKeyDown={(e) => {
              // Move focus to the previous input field on backspace
              if (e.key === 'Backspace' && index > 0) {
            if(e.target.value == ''){
              verificationCodeRefs[index - 1].current.focus();
            }else{
                 verificationCodeRefs[index].current.value = '';
            }
           
              }
            }}
            onPaste={(e)=>handlePasteCode(e)}

            ref={verificationCodeRefs[index]}
          />
        ))}
      </div>
      <div className=' w-full flex flex-row gap-2 '>
      <button onClick={()=>{handleVerifyCode()}} className=' mt-8 w-full border border-dblue rounded-md text-dblue py-3 bg-white hover:bg-dblue flex flex-row justify-center gap-5 hover:text-white transition-all '> <span>Submit{" "}</span> { loadingVerify&& <div className=' w-6 h-6'><Loader/></div>}</button>
      <button onClick={()=>{setOpenModal(false); setCodeSection(false)}} className=' mt-8 w-full border border-dblue rounded-md text-white py-3 bg-dblue hover:bg-dblue2  transition-all '> <span>Cancel{" "}</span> </button>
     
     </div>
  </div>
</div>
</div>
</div>
</div>
</div>


  )
}

export default AdressCard