import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    gravatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    bio: "",
    location: "",
    githubURL: "",
    twitterURL: "",
    available: true,
    website_URL: "",
    linkedinURL: "",
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [techStacks, setTechStacks] = useState([]);
  const [fieldOfIntrest, setFieldOfIntrest] = useState([]);
  const [seeking, setSeeking] = useState([]);
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
  const handleImageSubmit = (e) => {
    if (files.length > 0) {
      setUploading(true);
      setImageUploadError(false);

      const file = files[0];

      storeImage(file)
        .then((url) => {
          setFormData({
            ...formData,
            gravatar: url,
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          console.log(err);
          setImageUploadError("Image upload failed (2 MB max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("Please select an image to upload");
      setUploading(false);
    }
  };

  const storeImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              reject(error);
            });
        }
      );
    });
  };

  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      gravatar: "",
    });
  };

  const deleteIntrest = (index) => {
    const updated = fieldOfIntrest.filter((_, i) => i !== index);
    setFieldOfIntrest(updated);
  };
  const deleteTech = (index) => {
    const updated = techStacks.filter((_, i) => i !== index);
    setTechStacks(updated);
  };
  const deleteSeeking = (index) => {
    const updated = seeking.filter((_, i) => i !== index);
    setSeeking(updated);
  };
  const handleChange = (e) => {
   
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          cPassword: formData.cPassword,
          techStacks: techStacks,
          fieldOfIntrest: fieldOfIntrest,
          seeking: seeking,
          gravatar: formData.gravatar,
          bio: formData.bio,
          location: formData.location,
          githubURL: formData.githubURL,
          twitterURL: formData.twitterURL,
          available: true,
          website_URL: formData.website_URL,
          linkedinURL: formData.linkedinURL,
        }),
      });
      const data = await res.json();
      console.log(data);
      setLoading(false);
      if (data.success === false) {
       return setError(data.message);
      }
      navigate(`/sign-in`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Acadamy Student Sign Up
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="email"
            placeholder="email"
            className="border p-3 rounded-lg"
            id="email"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.email}
          />
          <input
            type="password"
            placeholder="password"
            className="border p-3 rounded-lg"
            id="password"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.password}
          />
          <input
            type="password"
            placeholder="cPassword"
            className="border p-3 rounded-lg"
            id="cPassword"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.cPassword}
          />

          <input
            type="text"
            placeholder="Location"
            className="border p-3 rounded-lg"
            id="location"
            required
            onChange={handleChange}
            value={formData.location}
          />
          <input
            type="text"
            placeholder="Github link"
            className="border p-3 rounded-lg"
            id="githubURL"
            required
            onChange={handleChange}
            value={formData.githubURL}
          />
          <input
            type="text"
            placeholder="Twitter link"
            className="border p-3 rounded-lg"
            id="twitterURL"
            required
            onChange={handleChange}
            value={formData.twitterURL}
          />
          <input
            type="text"
            placeholder="Website link"
            className="border p-3 rounded-lg"
            id="website_URL"
            required
            onChange={handleChange}
            value={formData.website_URL}
          />
          <input
            type="text"
            placeholder="Linkedin profile"
            className="border p-3 rounded-lg"
            id="linkedinURL"
            required
            onChange={handleChange}
            value={formData.linkedinURL}
          />

          <textarea
            type="text"
            placeholder="Bio..."
            className="border p-3 rounded-lg"
            id="bio"
            required
            onChange={handleChange}
            value={formData.bio}
          />
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">Proile picture:</p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-1/2 h-1/3"
              type="file"
              id="gravatar"
              accept="image/*"
            />
            <img
              className="p-3 border border-gray-300 rounded w-1/2"
              src={formData.gravatar}
            />
          </div>
          <button
            type="button"
            disabled={uploading}
            onClick={handleImageSubmit}
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>

          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>

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
                className="btn bg-slate-200 p-3 rounded-lg gap-2"
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
                className="btn bg-slate-200 p-3 rounded-lg gap-2"
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
                className="btn bg-slate-200 p-3 rounded-lg gap-2 cursor-pointer"
              >
                <span>{item}</span>
                <span onClick={() => deleteSeeking(index)}>❌</span>
              </div>
            ))}
          </div>
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Singinup.." : "Sign Up"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
