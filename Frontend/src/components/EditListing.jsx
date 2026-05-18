import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listingData, setListingData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const token = localStorage.getItem('token');
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/listings/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        const data = await response.json();
        setListingData(data);
        setImagePreview(data.image?.url || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listing", error);
        toast.error("Failed to fetch listing details");
        setLoading(false);
      }
    }
    fetchListing();
  }, [id, reset, token])

  useEffect(() => {
    if (listingData) {
      reset(listingData);
      setImagePreview(listingData.image?.url || null);
    }
  }, [listingData, reset]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }

  const onSubmit = async (data) => {
    const loadingToast = toast.loading('Updating listing...');
    try {
      const formData = new FormData();
      formData.append('listing[title]', data.title);
      formData.append('listing[description]', data.description);
      formData.append('listing[price]', data.price);
      formData.append('listing[country]', data.country);
      formData.append('listing[location]', data.location);
      if (data.image && data.image.length > 0) {
        formData.append('listing[image]', data.image[0]);
      }

      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/listings/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData,
        }
      )
      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success('Listing updated successfully!');
        navigate(`/listings/${id}`);
      } else {
        const err = await response.json();
        toast.dismiss(loadingToast);
        toast.error(err.message || 'Failed to update listing');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong!');
      console.error("Update failed:", error);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!listingData) return (
    <div className="text-center mt-8">
      <p className="text-red-500">Listing not found</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-8 p-8 bg-white rounded-xl ">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Edit Listing</h2>
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-6">
        <div>
          <label className="block font-medium mb-2 text-gray-700">Title</label>
          <input 
            {...register("title", { required: "Title is required" })} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Description</label>
          <textarea 
            {...register("description", { required: "Description is required" })} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px]"
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Price</label>
          <input 
            type="number" 
            {...register("price", { required: "Price is required" })} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Country</label>
          <input 
            {...register("country", { required: "Country is required" })} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Location</label>
          <input 
            {...register("location", { required: "Location is required" })} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Change Image (optional)</label>
          <input 
            type="file" 
            accept="image/*" 
            {...register("image")} 
            onChange={handleImageChange} 
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          {imagePreview && (
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="mt-4 w-full max-w-md object-contain rounded-lg shadow-md"
            />
          )}
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg"
        >
          Update Listing
        </button>
      </form>
    </div>
  )
}

export default EditListing;