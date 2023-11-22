import { useSelector } from "react-redux";
import React, { useRef, useState, useEffect, Suspense } from "react";
import Spinner from "../components/Spinner";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";
// import ProfileLayout from "../components/ProfileLayout";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [techStacks, setTechStacks] = useState(currentUser.techStacks);
  const [fieldOfIntrest, setFieldOfIntrest] = useState(currentUser.fieldOfIntrest);
  const [seeking, setSeeking] = useState(currentUser.seeking);
  const intrest = ["Security", "Full Stack", "Frontend", "Backend"];
  const technologies = [
    "Java",
    "JavaScript",
    "React",
    "Ruby Rails",
    "HTML/CSS",
  ];
  const seeks = ["intership", "Remote", "Not Seeking", "FT Position"];

  const handleIntrest = (event) => {
    const newItem = event.target.value;
    if (!fieldOfIntrest.includes(newItem)) {
      setFieldOfIntrest([...fieldOfIntrest, newItem]);
    }
  };
  const handleTechStack = (event) => {
    const newItem = event.target.value;
    if (!techStacks.includes(newItem)) {
      setTechStacks([...techStacks, newItem]);
    }
  };
  const handleSeeking = (event) => {
    const newItem = event.target.value;
    if (!seeking.includes(newItem)) {
      setSeeking([...seeking, newItem]);
    }
  };
  const deleteIntrest = (index) => {
    const updated = currentUser.fieldOfIntrest.filter((_, i) => i !== index);
    setFieldOfIntrest(updated);
  };
  const deleteTech = (index) => {
    const updated = currentUser.techStacks.filter((_, i) => i !== index);
    setTechStacks(updated);
  };
  const deleteSeeking = (index) => {
    const updated = currentUser.seeking.filter((_, i) => i !== index);
    setSeeking(updated);
  };

  const dispatch = useDispatch();

  const changePage = (index) => {
    // setCurrentIndex(index);
  };

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, gravatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/student/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...formData, fieldOfIntrest:fieldOfIntrest, seeking:seeking, techStacks:techStacks}),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/student/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  return (
    <>
      <Dashboard pageChange={changePage} />
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-4">
            <div className="flex items-center justify-center h-24 rounded dark:bg-gray-800">
              <span
                onClick={handleDeleteUser}
                className="self-center mb-4 text-sm bg-slate-100 px-4 py-2 uppercase rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none text-center"
              >
                Delete account
              </span>
            </div>
            <div className="flex items-center justify-center h-24 rounded dark:bg-gray-800">
              <span
                onClick={handleSignOut}
                className="self-center mb-4 text-sm bg-slate-100 px-4 py-2 uppercase rounded-sm shadow cursor-pointer focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 focus:outline-none text-center"
              >
                Sign out
              </span>
            </div>
          </div>
          <p className="text-red-700 mt-5">{error ? error : ""}</p>
          <p className="text-green-700 mt-5">
            {updateSuccess ? "User is updated successfully!" : ""}
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 md:flex-row"
          >
            <div className="flex flex-col gap-4 flex-1 md:w-full">
              <input
                type="text"
                placeholder="name"
                defaultValue={currentUser.name}
                id="name"
                className="border p-3 rounded"
                onChange={handleChange}
              />
              <input
                type="email"
                placeholder="email"
                id="email"
                defaultValue={currentUser.email}
                className="border p-3 rounded"
                onChange={handleChange}
              />
              <input
                type="password"
                placeholder="password"
                onChange={handleChange}
                id="password"
                className="border p-3 rounded"
              />
              <input
                type="text"
                placeholder="Location"
                className="border p-3 rounded-lg"
                id="location"
                required
                onChange={handleChange}
                defaultValue={currentUser.location}
              />
              <input
                type="text"
                placeholder="Github link"
                className="border p-3 rounded-lg"
                id="githubURL"
                required
                onChange={handleChange}
                defaultValue={currentUser.githubURL}
              />
              <input
                type="text"
                placeholder="Twitter link"
                className="border p-3 rounded-lg"
                id="twitterURL"
                required
                onChange={handleChange}
                defaultValue={currentUser.twitterURL}
              />
              <input
                type="text"
                placeholder="Website link"
                className="border p-3 rounded-lg"
                id="website_URL"
                required
                onChange={handleChange}
                defaultValue={currentUser.website_URL}
              />
              <input
                type="text"
                placeholder="Linkedin profile"
                className="border p-3 rounded-lg"
                id="linkedinURL"
                required
                onChange={handleChange}
                defaultValue={currentUser.linkedinURL}
              />

              <textarea
                type="text"
                placeholder="Bio..."
                className="border p-3 rounded-lg"
                id="bio"
                required
                onChange={handleChange}
                defaultValue={currentUser.bio}
              />
            </div>
            <div className="flex flex-col gap-4 flex-1 md:w-full">
              <div className=" flex justify-center pb-5 gap-5">
                <input
                  onChange={(e) => setFile(e.target.files[0])}
                  type="file"
                  ref={fileRef}
                  hidden
                  accept="image/*"
                />
                <img
                  onClick={() => fileRef.current.click()}
                  src={formData.gravatar || currentUser.gravatar}
                  alt="profile"
                  className="rounded h-36 w-36 object-cover cursor-pointer self-center mt-2"
                />
                <p className="text-sm self-center">
                  {fileUploadError ? (
                    <span className="text-red-700">
                      Error Image upload (image must be less than 2 mb)
                    </span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
                  ) : filePerc === 100 ? (
                    <span className="text-green-700">
                      Image successfully uploaded!
                    </span>
                  ) : (
                    ""
                  )}
                </p>
              </div>
              <div className="flex justify-between">
                <span>Filed of intrest</span>
                <select
                  name="intrest"
                  className="border rounded p-1"
                  onChange={handleIntrest}
                >
                  {intrest.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="gap-3 flex flex-wrap">
                {fieldOfIntrest?.map((item, index) => (
                  <div
                    key={index}
                    className="btn bg-slate-200 p-2 text-xs rounded-lg gap-2 cursor-pointer"
                  >
                    <span>{item}</span>
                    <span onClick={() => deleteIntrest(index)}>❌</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <span>Tech Stcks</span>
                <select
                  name="intrest"
                  className="border rounded p-1"
                  onChange={handleTechStack}
                >
                  {technologies.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="gap-3 flex flex-wrap">
                {techStacks?.map((item, index) => (
                  <div
                    key={index}
                    className="btn bg-slate-200 p-2 text-xs rounded-lg gap-2 cursor-pointer"
                  >
                    <span>{item}</span>
                    <span onClick={() => deleteTech(index)}>❌</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between">
                <span>Seeking </span>
                <select
                  name="seeking"
                  className="border rounded p-1"
                  onChange={handleSeeking}
                >
                  {seeks.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="gap-3 flex flex-wrap">
                {seeking?.map((item, index) => (
                  <div
                    key={index}
                    className="btn bg-slate-200 p-2 text-xs rounded-lg gap-2 cursor-pointer"
                  >
                    <span>{item}</span>
                    <span onClick={() => deleteSeeking(index)}>❌</span>
                  </div>
                ))}
              </div>
              <button
                disabled={loading}
                className="bg-slate-700 text-white rounded p-3 uppercase hover:opacity-95 disabled:opacity-80"
              >
                {loading ? "Loading..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
