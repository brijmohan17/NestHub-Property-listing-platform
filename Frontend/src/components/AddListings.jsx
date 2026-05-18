import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddListings = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const loadingToast = toast.loading('Creating listing...');
    try {
      const formData = new FormData();

      formData.append('listing[title]', data.title);
      formData.append('listing[description]', data.description);
      formData.append('listing[price]', data.price);
      formData.append('listing[country]', data.country);
      formData.append('listing[location]', data.location);
      formData.append('listing[image]', data.image[0]);
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/listings`, {
        method: 'POST',
        headers:{
            "Authorization":`Bearer ${token}`
        },
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success('Listing created successfully!');
        navigate('/');
      } else {
        toast.dismiss(loadingToast);
        toast.error(result.message || result.error || 'Failed to create listing');
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong!');
      console.error('Error:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  // Optional cleanup of image preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <div className='max-w-3xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-lg'>
      <h1 className='text-4xl font-bold mb-8 text-gray-800'>Create New Listing</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6' encType='multipart/form-data'>
        {/* Title */}
        <div>
          <label htmlFor='title' className='block font-medium mb-2 text-gray-700'>Title</label>
          <input
            id='title'
            {...register('title', { required: 'Title is required' })}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
            placeholder='Add a catchy title'
          />
          {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor='description' className='block font-medium mb-2 text-gray-700'>Description</label>
          <textarea
            id='description'
            {...register('description', { required: 'Description is required' })}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition min-h-[120px]'
            placeholder='Describe your property...'
          ></textarea>
          {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
        </div>

        {/* Image Upload */}
        <div>
          <label htmlFor='image' className='block font-medium mb-2 text-gray-700'>Upload Image</label>
          <input
            type='file'
            accept='image/*'
            {...register('image', { required: 'Image is required' })}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
            onChange={handleImageChange}
          />
          {errors.image && <p className='text-red-500 text-sm mt-1'>{errors.image.message}</p>}
          {imagePreview && (
            <img
              src={imagePreview}
              alt='Preview'
              className='mt-4 w-full max-w-md object-contain rounded-lg shadow-md'
            />
          )}
        </div>

        {/* Price and Country */}
        <div className='md:flex gap-6'>
          <div className='md:w-1/3'>
            <label htmlFor='price' className='block font-medium mb-2 text-gray-700'>Price</label>
            <input
              {...register('price', { required: 'Price is required' })}
              type='number'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              placeholder='1200'
            />
            {errors.price && <p className='text-red-500 text-sm mt-1'>{errors.price.message}</p>}
          </div>

          <div className='md:w-2/3'>
            <label htmlFor='country' className='block font-medium mb-2 text-gray-700'>Country</label>
            <input
              {...register('country', { required: 'Country is required' })}
              type='text'
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
              placeholder='India'
            />
            {errors.country && <p className='text-red-500 text-sm mt-1'>{errors.country.message}</p>}
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor='location' className='block font-medium mb-2 text-gray-700'>Location</label>
          <input
            type='text'
            {...register('location', { required: 'Location is required' })}
            className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition'
            placeholder='Jaipur, Rajasthan'
          />
          {errors.location && <p className='text-red-500 text-sm mt-1'>{errors.location.message}</p>}
        </div>

        {/* Submit Button */}
        <button 
          type='submit' 
          className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg'
        >
          Create Listing
        </button>
      </form>
    </div>
  );
};

export default AddListings;
