import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Review from '../components/Review';

const SingleListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListing = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/listings/${id}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setListing(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load listing');
      toast.error('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]); // ← no infinite loop

  const handleReviewCreate = (updatedListing) => {
    setListing(updatedListing);
  };

  const handleReviewDelete = (deletedReviewId) => {
    setListing((prev) => ({
      ...prev,
      review: prev.review.filter((r) => r._id !== deletedReviewId),
    }));
  };

  const handleDeleteListing = async () => {
    const loadingId = toast.loading('Deleting listing…');
    const token = localStorage.getItem('token');
    if (!token) {
      toast.dismiss(loadingId);
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/listings/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.dismiss(loadingId);
      if (!res.ok) {
        toast.error('Failed to delete listing');
        return;
      }
      toast.success('Listing deleted successfully!');
      navigate('/');
    } catch (err) {
      toast.dismiss(loadingId);
      console.error(err);
      toast.error('Something went wrong!');
    }
  };

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isOwner =
    currentUser &&
    listing &&
    ((listing.owner._id && listing.owner._id === currentUser.id) ||
      listing.owner === currentUser.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500">{error || 'Listing not found'}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl">
        <img
          src={listing.image?.url}
          alt={listing.title}
          className="w-full h-[300px] object-cover rounded-lg mb-6 shadow-md"
        />

        <div className="space-y-6">
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              {listing.title}
            </h2>
            <p className="text-gray-600">
              Owned by{' '}
              <span className="font-semibold text-gray-800">
                {listing.owner?.username}
              </span>
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-lg text-gray-700 mb-4">
              {listing.description}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-800">
                ₹{listing.price?.toLocaleString('en-IN')}/night
              </p>
              <p className="text-gray-600">
                <FaMapMarkerAlt className="inline mr-1" />
                {listing.location}, {listing.country}
              </p>
            </div>
          </div>

          {isOwner && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/listings/${id}/edit`)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
              >
                Edit Listing
              </button>
              <button
                onClick={handleDeleteListing}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
              >
                Delete Listing
              </button>
            </div>
          )}

          <div className="mt-8">
            <Review
              listingId={id}
              reviews={listing.review}
              onReviewCreate={handleReviewCreate}
              onReviewDelete={handleReviewDelete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleListing;
