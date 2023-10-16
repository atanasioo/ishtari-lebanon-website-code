import { axiosServer } from "@/axiosServer";
import PointsLoader from "@/components/PointsLoader";
import SingleProductFlashSale from "@/components/product/SingleProductFlashSale";
import { AccountContext } from "@/contexts/AccountContext";
import buildLink from "@/urls";
import cookie from "cookie";
import { useContext, useEffect, useState } from "react";
import { IoIosAlert } from "react-icons/io";

function flashSale(props) {
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [accountState, dispatchAccount] = useContext(AccountContext);
  const [loading, setLoading] = useState(false);
  const [productsTab, setProductsTab] = useState([]);
  const [successReminder, setSuccessReminder] = useState("");
  const [errReminder, setErrReminder] = useState("");
  const [nosale, setNoSale] = useState(false);
  const [reminder, setReminder] = useState({
    product_id: 0,
    state: false,
  });

  function handleReminder(event, product_id, flash_sale_event_id) {
    event.preventDefault();
    if (accountState.loged) {
      setReminder({
        product_id: product_id,
        state: true,
      });
      const obj = {
        product_id: product_id,
        flash_sale_event_id: flash_sale_event_id,
      };
      axiosServer
        .post(buildLink("addReminderForFlashSale", undefined, undefined), obj)
        .then((response) => {
          if (response.data.success) {
            axiosServer
              .get(
                buildLink("getFlashSale", undefined, undefined) + "&flash_sale_event_id=" +
                  data[activeTab].flash_sale_event_id
              )
              .then((resp) => {
                if (resp.data.success) {
                  setProductsTab(resp.data.data[0].products);
                } else {
                  setNoSale(true);
                }
                setSuccessReminder("Reminder set successfully");
                setTimeout(() => {
                  setSuccessReminder("");
                  setReminder({
                    product_id: 0,
                    state: false,
                  });
                }, 3000);
                setErrReminder("");
              });
          } else {
            setErrReminder(response.data.message);
            setTimeout(() => {
              setErrReminder("");
              setReminder({
                product_id: 0,
                state: false,
              });
            }, 3000);
            setSuccessReminder("");
          }
        });
    } else {
      dispatchAccount({ type: "setShowOver", payload: true });
      dispatchAccount({ type: "setShowLogin", payload: true });
      dispatchAccount({ type: "setShowSignup", payload: false });
    }
  }

  function handleTabClick(index, resp) {
    console.log("data in handle tab", data);
    setNoSale(false);
    setLoading(true);
    setActiveTab(index);
    axiosServer
      .get(
        buildLink("getFlashSale", undefined, undefined) +
          "&flash_sale_event_id=" +
          `${
            data && data.length > index && data[index].flash_sale_event_id
              ? data[index].flash_sale_event_id
              : resp[index].flash_sale_event_id
          }`
      )
      .then((response) => {
        if (response.data.success) {
          setProductsTab(response.data.data[0].products);
        } else {
          setNoSale(true);
        }
        setLoading(false);
      });
  }

  useEffect(() => {
    axiosServer
      .get(buildLink("getFlashSale", undefined, undefined))
      .then((response) => {
        if (response.data.success) {
          setData(response.data.data);
          setProductsTab(response.data.data[activeTab].products);
          console.log("response data", response.data);
          if (
            !response.data.data[0].on_sale_now &&
            response.data.data[0].products.length === 0
          ) {
            setActiveTab(1);
            handleTabClick(1, response.data.data);
          }
        }
      });
  }, []);

  return (
    <div className="">
      <div
        className="sale-tabs w-full h-24 flex items-center justify-center"
        style={{ backgroundColor: "#facf19" }}
      >
        {data?.map((sale_tab, i) => (
          <div
            onClick={() => handleTabClick(i)}
            className={`text-center h-full flex flex-col justify-center cursor-pointer ${
              sale_tab.products.length === 0 && i === 0 ? "hidden" : ""
            }  ${activeTab === i ? "border-b-2 border-dgrey1 " : "opacity-40"}`}
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
          <div className="text-d25 pr-semibold ">
            There is currently no ongoing sale.{" "}
          </div>
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
              reminder={reminder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const { req } = context;
//   const { page, limit } = context.query;
//   const host = req.headers.host;
//   const cookies = req.headers.cookie;
//   const parsedCookies = cookie.parse(cookies);
//   const host_cookie = parsedCookies["site-local-name"];
//   const token = parsedCookies["api-token"];
//   var data = {};
//   let site_host = "";
//   if (host_cookie === undefined || typeof host_cookie === "undefined") {
//     site_host = host;
//   } else {
//     site_host = host_cookie;
//   }

//   const response = await axiosServer.get(
//     buildLink("getFlashSale", undefined, undefined, site_host),
//     {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     }
//   );

//   data = response.data.data;

//   console.log("response data" , response.data);

//   return {
//     props: {
//       data: data,
//     },
//   };
// }

export default flashSale;
