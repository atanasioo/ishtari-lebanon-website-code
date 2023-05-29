import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function NotFound() {
  const router = useRouter();
  return (
    <div className="flex items-center justify-center  py-20 flex-col">
      <img src={"/images/page-404.webp"} className=" w-2/12" alt="Not Found" />
      <h2 className="text-2xl mt-4">Sorry, there is nothing here!</h2>
      <Link
        href={`/`}
        className="bg-dblue text-white px-10 py-3 rounded mt-4"
      >
        START SHOPPING
      </Link>
      <button
        onClick={() => router.back()}
        className="bg-dbase text-white px-10 py-3 rounded mt-4"
      >
        Go back
      </button>
    </div>
  );
}

export default NotFound;
