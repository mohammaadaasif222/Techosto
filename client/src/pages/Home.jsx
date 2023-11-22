import React, { useEffect, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import Spinner from "../components/Spinner";

const StudentCard = React.lazy(() => import("../components/StudentCard"));

export default function Home() {
  const [students, setStudents] = useState([]);

  SwiperCore.use([Navigation]);
  console.log(students);
  const fecthStudents = async () => {
    try {
      const res = await fetch("/api/student/all");
      const data = await res.json();
      console.log(data);
      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fecthStudents();
  }, []);
  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* listing results for offer, sale and rent */}

      <div className="lg:w-2/3 md:w-full sm:w-full justify-center mx-auto p-3 flex flex-col gap-8 my-10">
        {students &&
          students.length > 0 &&
          students.map((student) => (
            <Suspense key={student._id} fallback={<Spinner />}>
              <StudentCard student={student} key={student._id} />
            </Suspense>
          ))}
      </div>
    </div>
  );
}
