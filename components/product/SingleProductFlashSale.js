import Link from "next/link";
import { BsBell } from "react-icons/bs";
import { MdOutlineElectricBolt } from "react-icons/md";
import { slugify } from "../Utils";
import useDeviceSize from "../useDeviceSize";

function SingleProductFlashSale(props) {
  const { handleReminder, item, data, successReminder, errReminder, reminder } = props;
  const [ width ] =useDeviceSize();

  return (
    <Link
      href={`/${slugify(item.full_name)}/p=${item.product_id}`}
      className="bg-white relative  md:w-[303px]"
    >
      <div className="flash absolute z-10 top-0 left-0">
        <div
          className="pt-2.5 pb-1.5 px-1.5 flex flex-col justify-center items-center"
          style={{ backgroundColor: "#facf19" }}
        >
          <MdOutlineElectricBolt className="w-5 h-5" />
          <div>-%{item.saving}</div>
        </div>
      </div>
      <div>
        <img
          src={item.thumb_sdesktop}
          width={width > 768 ? 303 : 180}
          height={width > 768 ? 403 : 300}
          alt={item.full_name}
          className="w-full  md:h-[403px] "
        />

        <div className="product-info-wrapper py-3 px-2">
          <div className="hover:underline">{item.name}</div>
          <div className="flex items-center gap-2">
            <div className="text-d24 pr-bold text-dbase">{item.special}</div>
            <div className="line-through text-dgreyProduct">{item.price}</div>
          </div>
          {data.on_sale_now ? (
            <div className="flex justify-between">
              <div
                className="rounded-full w-8/12 px-2 flex items-center text-xs"
                style={{ backgroundColor: "#f6f6f6" }}
              >
                On Sale
              </div>
              <div className="text-sm pr-bold border border-b-dblackk py-1 px-3">
                Buy Now
              </div>
            </div>
          ) : (
            <div>
              <div className="text-dgrey1 pb-1.5">
                {item.numberOfReminders} user(s) subscribe in advance
              </div>
              {successReminder.length > 0 && reminder.state && reminder.product_id === item.product_id ? (
                <div className="flex justify-center gap-2 text-dgreen items-center w-full border border-b-dblackk py-2 text-d18">
                  <div>{successReminder}</div>
                </div>
              ) : errReminder.length > 0 && reminder.state && reminder.product_id === item.product_id ? (
                <div className="flex justify-center gap-2 text-dbase items-center w-full border border-b-dblackk py-2 text-d18">
                  <div>{errReminder}</div>
                </div>
              ) : (
                <div
                  className="flex justify-center gap-2 items-center w-full border border-b-dblackk py-2 text-d18"
                  onClick={(e) => {
                    handleReminder(
                      e,
                      item.product_id,
                      data.flash_sale_event_id
                    );
                    
                  }}
                >
                  <BsBell />
                  <div>Remind Me</div>
                </div>
              )}
            </div>
          )}
          <div></div>
        </div>
      </div>
    </Link>
  );
}

export default SingleProductFlashSale;
