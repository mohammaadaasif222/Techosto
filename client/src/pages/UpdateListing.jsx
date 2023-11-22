import { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    make: "",
    description: "",
    model: "",
    year: 2020,
    rentalPrice: 50,
    available: true,
    transmission: "Automatic",
    fuelType: "",
    mileage: 10,
    color: "",
    discountPrice: 0,
    offer: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feature, setFeature] = useState("");
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);
  const addFeature = () => {
    if (feature.trim() !== "") {
      setFeatures([...features, feature]);
    }
    setFeature("");
  };
  const deleteFeature = (index) => {
    const updated = features.filter((_, i) => i !== index);
    setFeatures(updated);
  };

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
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
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "automatic" || e.target.id === "manual") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          features:features,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="make"
            maxLength="62"
            minLength="5"
            required
            onChange={handleChange}
            value={formData.make}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="model"
            className="border p-3 rounded-lg"
            id="model"
            required
            onChange={handleChange}
            value={formData.model}
          />
          <input
            type="number"
            placeholder="year"
            className="border p-3 rounded-lg"
            id="year"
            required
            onChange={handleChange}
            value={formData.year}
          />
          <input
            type="number"
            placeholder="Rent Price"
            className="border p-3 rounded-lg"
            id="rentalPrice"
            required
            onChange={handleChange}
            value={formData.rentalPrice}
          />
          <input
            type="text"
            placeholder="Fuel Type..."
            className="border p-3 rounded-lg"
            id="fuelType"
            required
            onChange={handleChange}
            value={formData.fuelType}
          />
          <input
            type="number"
            placeholder="Mileage"
            className="border p-3 rounded-lg"
            id="mileage"
            required
            onChange={handleChange}
            value={formData.mileage}
          />
          <input
            type="text"
            placeholder="Color"
            className="border p-3 rounded-lg"
            id="color"
            required
            onChange={handleChange}
            value={formData.color}
          />
          <input
            type="number"
            placeholder="Discount Price"
            className="border p-3 rounded-lg"
            id="discountPrice"
            required
            onChange={handleChange}
            value={formData.discountPrice}
          />
          <div className="flex gap-4 flex-wrap justify-between">
            <input
              type="text"
              placeholder="Type a feature..."
              className="border p-3 rounded-lg w-3/5"
              id="features"
              onChange={(e) => setFeature(e.target.value)}
              value={feature}
            />
            <span
              className="btn p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 text-center cursor-pointer"
              onClick={addFeature}
            >
              Add Features
            </span>
            {features?.map((item, index) => (
              <li key={index}>
                <span>{item}</span>
                <span onClick={() => deleteFeature(index)}>❌</span>
              </li>
            ))}
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="automatic"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "automatic"}
              />
              <span>Automatic</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="manual"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "manual"}
              />
              <span>Manual</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="available"
                className="w-5"
                onChange={handleChange}
                checked={formData.available}
              />
              <span>Available</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updateing..." : "Update listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
