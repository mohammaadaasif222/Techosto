import React, { useEffect, useState, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
const StudentCard = React.lazy(() => import("../components/StudentCard"));

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    offer: false,
    sort: "created_at",
    order: "desc",
    interest: "",
    tech: "",
    seeking: "",
  });

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || typeFromUrl || sortFromUrl || orderFromUrl) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchStudent = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/student/all?${searchQuery}`);
      const data = await res.json();

      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setStudents(data);
      setLoading(false);
    };

    fetchStudent();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "all") {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    // if (e.target.id === "offer") {
    //   setSidebardata({
    //     ...sidebardata,
    //     [e.target.id]:
    //       e.target.checked || e.target.checked === "true" ? true : false,
    //   });
    // }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleIntrest = (e) => {
    setSidebardata({ ...sidebardata, interest: e.target.value });
  };
  const handleTechStack = (e) => {
    setSidebardata({ ...sidebardata, tech: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    if (sidebardata.interest !== undefined) {
      urlParams.set("interest", sidebardata.interest);
    }
    if (sidebardata.tech !== undefined ) {
      urlParams.set("tech", sidebardata.tech);
    }
    if (sidebardata.seeking !== undefined) {
      urlParams.set("seeking", sidebardata.seeking);
    }

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfstudent = students.length;
    const startIndex = numberOfstudent;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/student/all?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setStudents([...students, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>All</span>
            </div>
{/* 
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div> */}
          </div>
          <div className="flex gap-2 lg:flex-row md:flex-col sm:flex-col items-center ">
            <label htmlFor="techStacks" className="font-semibold">
              Tech Stack
            </label>
            <br />
            <select
              data-te-select-init
              className="w-1/2  p-2 rounded"
              onChange={handleTechStack}
            >
              <option value="Ruby Rails">Ruby Rails</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Hmtl/css">HTML/CSS</option>
              <option value="Java">Java</option>
              <option value="React">React</option>
              <option value="Node.js">Node.js</option>
            </select>
          </div>
          <div className="flex gap-2 lg:flex-row md:flex-col sm:flex-col items-center ">
            <label htmlFor="filedOfInterest" className="font-semibold">
              Filed of interest
            </label>
            <br />
            <select
              data-te-select-init
              className="w-1/2 p-2 rounded"
              onChange={handleIntrest}
            >
              <option value="security">Security</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="backend">Backend</option>
              <option value="Full Stack">Full Stack</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded w-1/2 p-2"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Search results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && students.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading && students ? (
            students.map((student) => (
              <Suspense key={student._id} fallback={<Spinner />}>
                <StudentCard student={student} />
              </Suspense>
            ))
          ) : (
            <p>No results found</p>
          )}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
