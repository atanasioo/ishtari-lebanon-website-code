import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function NotFound() {
  const router = useRouter();
  return (
    <div class="h-screen w-screen bg-gray-100 flex items-center">
      <div class="container flex flex-col md:flex-row items-center justify-center px-5 text-gray-700">
        <div class="max-w-md">
          <div class="text-5xl font-dark font-bold">404</div>
          <p class="text-2xl md:text-3xl font-light leading-normal">
            Sorry we couldn't find this page.{" "}
          </p>
          <p class="mb-8">
            But dont worry, you can find plenty of other things on our homepage.
          </p>

          <button
            onClick={() => router.push("/")}
            class="px-4 inline py-2 text-md font-medium leading-5 shadow text-white transition-colors duration-150 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-dblue active:bg-blue-600 hover:bg-blue-700"
          >
            Back to homepage
          </button>
        </div>
        <div class="max-w-lg">
          <img src={"/images/notfound.jpeg"} alt="404 Not Found" />
        </div>
      </div>
    </div>
  );
}

export default NotFound;
