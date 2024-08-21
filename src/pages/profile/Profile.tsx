import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Profile: React.FC = () => {
  const langData = useTranslation();

  // State for form values
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for image and preview

  const [image, setImage] = useState<string | null>(null);

  // Retrieve data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      const data = JSON.parse(savedData);
      setFormData(data);
      // If an image URL is saved, set it as the image
      if (data.image) {
        setImage(data.image);
      }
    } else {
      // Initialize with default values if no data is found in localStorage
      setFormData({
        username: "johndoe",
        email: "johndoe@example.com",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      });
    }
  }, []);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImage(result);
          // Update formData with the image URL for saving
          setFormData((prev) => ({
            ...prev,
            image: result,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate a form submission (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Save profile data to localStorage
      localStorage.setItem("profileData", JSON.stringify(formData));

      // Update profile successfully
      alert("Profile updated successfully!");
    } catch (err: unknown) {
      // Handle submission error
      setError("Failed to update profile. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img
              src={image || "https://www.w3schools.com/w3images/avatar2.png"} // Use selected image or default image
              alt="Profile Avatar"
              className="w-24 h-24 rounded-full border-2 border-gray-300"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute bottom-0 right-0 opacity-0 w-8 h-8 cursor-pointer"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="absolute bottom-0 right-0 p-1 bg-blue-500 text-white rounded-full cursor-pointer"
            >
              📷
            </label>
          </div>
          <div className="ml-4">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              {formData.username}
            </h1>
            <p className="text-gray-600">{formData.email}</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {langData.t("profile.profileInfo")}
          </h2>
          <p className="text-gray-600 mb-2">
            {langData.t("profile.username")}: {formData.username}
          </p>
          <p className="text-gray-600 mb-2">
            {langData.t("profile.joined")}: January 1, 2023
          </p>
          <p className="text-gray-600 mb-2">
            {langData.t("profile.bio")}: {formData.bio}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {langData.t("profile.updateProfile")}
          </h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-1">
                {langData.t("profile.username")}
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-1">
                {langData.t("profile.email")}
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-gray-700 mb-1">
                {langData.t("profile.bio")}
              </label>
              <textarea
                id="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your bio"
              ></textarea>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg ${
                  loading ? "bg-gray-400" : "bg-blue-500"
                } text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
