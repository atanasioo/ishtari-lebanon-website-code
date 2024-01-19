import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function NotFound() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center">
      <div className="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
        <div className="max-w-md">
          <div className="text-5xl font-dark font-bold">404</div>
          <p className="text-2xl md:text-3xl font-light leading-normal">
            Sorry we couldn't find this page.{" "}
          </p>
          <p className="mb-8">
            But dont worry, you can find plenty of other things on our homepage.
          </p>

          <button
            onClick={() => router.push("/")}
            className="px-4 inline py-2 text-md font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-dbase active:bg-red-600 hover:bg-red-700"
          >
            Back to homepage
          </button>
        </div>
        <div className="max-w-lg">
          <img src={"/images/notfound.jpeg"} alt="404 Not Found" />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
