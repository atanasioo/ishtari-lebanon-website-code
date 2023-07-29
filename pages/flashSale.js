import { axiosServer } from "@/axiosServer";
import SingleProductFlashSale from "@/components/product/SingleProductFlashSale";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import cookie from "cookie";
import dynamic from "next/dynamic";
import { useContext, useEffect, useState } from "react";
import { IoIosAlert } from "react-icons/io";

function flashSale(props) {
  console.log(props.data);
  const { data } = props;
  const [activeTab, setActiveTab] = useState(0);
  const [accountState, dispatchAccount] = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [productsTab, setProductsTab] = useState([]);
  const [successReminder, setSuccessReminder] = useState("");
  const [errReminder, setErrReminder] = useState("");
  const [nosale, setNoSale] = useState(false);

  const PointsLoader = dynamic(() => import("@/components/PointsLoader"), {
    ssr: false, // Disable server-side rendering
  });

  useEffect(() => {
    setProductsTab(data[activeTab].products);
  }, []);

  function handleReminder(event, product_id, date_start) {
    event.preventDefault();
    if (accountState.loged) {
      const obj = {
        product_id: product_id,
        date_start: date_start,
      };
      axiosServer
        .post(buildLink("addReminderForFlashSale", undefined, undefined), obj)
        .then((response) => {
          console.log(response);
          if(response.data.success){
            setSuccessReminder("Reminder set successfully");
            setTimeout(()=>{
              setSuccessReminder("");
            },3000)
            setErrReminder("");
          }else{
            console.log(response.data.message);
            setErrReminder(response.data.message);
            setTimeout(()=>{
              setErrReminder("");
            },3000)
            setSuccessReminder("");
          }
        });
    } else {
      dispatchAccount({ type: "setShowOver", payload: true });
      dispatchAccount({ type: "setShowLogin", payload: true });
      dispatchAccount({ type: "setShowSignup", payload: false });
    }
  }

  function handleTabClick(index) {
    setNoSale(false);
    setLoading(true);
    setActiveTab(index);
    axiosServer
      .get(
        buildLink("getFlashSale", undefined, undefined) + data[index].date_start
      )
      .then((response) => {
        console.log(response);
        if(response.data.success){
          setProductsTab(response.data.data[0].products);
        }else{
          setNoSale(true);
        }
        setLoading(false);
      });
  }

  return (
    <div className="">
      <div
        className="sale-tabs w-full h-24 flex items-center justify-center"
        style={{ backgroundColor: "#facf19" }}
      >
        {data?.map((sale_tab, i) => (
          <div
            onClick={() => handleTabClick(i)}
            className={`text-center h-full flex flex-col justify-center cursor-pointer  ${
              activeTab === i ? "border-b-2 border-dgrey1" : ""
            }`}
            style={{ width: `calc(100% / ${data.length})` }}
            key={i}
          >
            <div className="flex justify-center items-end gap-2">
              <div className="pr-bold text-d20">{sale_tab.time}</div>
              <div className="text-sm">{sale_tab.date_formated}</div>
            </div>
            <div className="text-d14">
              {sale_tab.on_sale_now ? "On Sale Now" : "Coming Later"}
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <PointsLoader />
      ) : nosale ? (
        <div className="flex flex-col justify-center items-center mt-20 gap-2">
         <div className="text-d25 pr-semibold ">There is currently no ongoing sale. </div>
         <div>
          <IoIosAlert className="w-11 h-11" />
         </div>
        </div>
      ) : (
        <div className="products-wrapper pb-5 mt-5 grid grid-cols-4 gap-3">
          {productsTab?.map((item) => (
            <SingleProductFlashSale
              key={item.product_id}
              item={item}
              data={data[activeTab]}
              handleReminder={handleReminder}
              successReminder={successReminder}
              errReminder={errReminder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const { page, limit } = context.query;
  const host = req.headers.host;
  const cookies = req.headers.cookie;
  const parsedCookies = cookie.parse(cookies);
  const host_cookie = parsedCookies["site-local-name"];
  const token = parsedCookies["api-token"];
  var data = {};
  let site_host = "";
  if (host_cookie === undefined || typeof host_cookie === "undefined") {
    site_host = host;
  } else {
    site_host = host_cookie;
  }

  const response = await axiosServer.get(
    buildLink("getFlashSale", undefined, undefined, site_host),
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  data = response.data.data;

  console.log(response);

  return {
    props: {
      data: data,
    },
  };
}

export default flashSale;
