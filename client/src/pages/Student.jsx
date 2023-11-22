import React, { Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import Spinner from "../components/Spinner";

export default function student() {
  SwiperCore.use([Navigation]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/student/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setStudent(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchStudent();
  }, [params.id]);

  console.log(student);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      <div class="">
        <div class="container mx-auto py-8">
          <div class="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
            <div class="col-span-4 sm:col-span-3">
              <div class="bg-white shadow rounded-lg p-6">
                <div class="flex flex-col items-center">
                  <img
                    src={student?.gravatar}
                    class="w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0"
                  ></img>
                  <h1 class="text-xl font-bold">{student?.name}</h1>
                  <p class="text-gray-600">{student?.fieldOfIntrest[0]}</p>
                  <div class="mt-6 flex flex-wrap gap-4 justify-center">
                    <a
                      href="#"
                      class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                    >
                      Contact
                    </a>
                    <a
                      href="#"
                      class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded"
                    >
                      Resume
                    </a>
                  </div>
                </div>
                <hr class="my-6 border-t border-gray-300" />
                <div class="flex flex-col">
                  <span class="text-gray-600 uppercase font-bold tracking-wider mb-2">
                    Skills
                  </span>
                  <ul>
                    {student?.techStacks?.map((item, index) => (
                      <li key={item} class="mb-2">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div class="col-span-4 sm:col-span-9">
              <div class="bg-white shadow rounded-lg p-6">
                <h2 class="text-xl font-bold mb-4">About {student?.name}</h2>
                <p class="text-gray-700">{student?.bio}</p>

                <h3 class="font-semibold text-center mt-3 -mb-2">Find me on</h3>
                <div class="flex justify-center items-center gap-6 my-6">
                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds LinkedIn"
                    href={student?.linkedinURL}
                    target="_blank"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      class="h-6"
                    >
                      <path
                        fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                      ></path>
                    </svg>
                  </a>

                  <a
                    class="text-gray-700 hover:text-orange-600"
                    aria-label="Visit TrendyMinds Twitter"
                    href={student?.twitterURL}
                    target="_blank"
                  >
                    <svg
                      class="h-6"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path
                        fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                      ></path>
                    </svg>
                  </a>
                </div>

                <h2 class="text-xl font-bold mt-6 mb-4">
                  Personal Information
                </h2>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Tech Stacks</span>
                    <p>
                      {student?.techStacks?.map((item, index) => (
                        <span key={item} class="text-gray-600 mr-2  ">
                          {item},
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Seeking</span>
                    <p>
                      {student?.seeking?.map((item, index) => (
                        <span key={item} class="text-gray-600 mr-2">
                          {item},
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
                <div class="mb-6">
                  <div class="flex justify-between">
                    <span class="text-gray-600 font-bold">Contact</span>
                    <p>
                      <p class="text-gray-600 mr-2"><b>Email:</b> {student?.email},</p>
                      <p class="text-gray-600 mr-2"> <b>Location:</b> {student?.location},</p>
                      <p class="text-gray-600 mr-2"><b>Website:</b> {student?.website_URL},</p>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
