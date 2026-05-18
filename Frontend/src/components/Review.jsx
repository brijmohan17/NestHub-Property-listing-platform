import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import 'starability/starability-css/starability-slot.css';

const Review = ({
  listingId,
  reviews = [],
  onReviewCreate,
  onReviewDelete,
}) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const ratingRef = useRef(null);

  // 🔥 Compute currentUser once so we can check ownership below
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please log in to submit a review');
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/listings/${listingId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ review: { rating, comment } }),
        }
      );
      if (!res.ok) throw new Error('Failed to submit review');
      const data = await res.json();

      toast.success('Review submitted successfully!');
      // reset form
      setRating(0);
      setComment('');
      ratingRef.current
        .querySelectorAll('input[type="radio"]')
        .forEach((r) => (r.checked = false));

      // tell parent
      if (onReviewCreate) onReviewCreate(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!token) {
      toast.error('Please log in to delete a review');
      return;
    }
    const loadingId = toast.loading('Deleting review…');
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SERVER_DOMAIN}/listings/${listingId}/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error('Delete failed');
      toast.dismiss(loadingId);
      toast.success('Review deleted successfully!');
      if (onReviewDelete) onReviewDelete(reviewId);
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingId);
      toast.error('Could not delete review. Try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset
          ref={ratingRef}
          onChange={(e) => setRating(Number(e.target.value))}
          className="starability-slot"
        >
          <legend className="text-sm font-medium text-gray-700 mb-2">
            Rate this listing:
          </legend>
          {[5, 4, 3, 2, 1].map((star) => (
            <React.Fragment key={star}>
              <input
                type="radio"
                id={`rate${star}`}
                name="rating"
                value={star}
              />
              <label htmlFor={`rate${star}`} title={`${star} stars`}>
                {`${star} stars`}
              </label>
            </React.Fragment>
          ))}
        </fieldset>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 transition min-h-[100px]"
            placeholder="Share your experience…"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !rating || !comment}
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition duration-300 ${
            isSubmitting || !rating || !comment
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Submitting…' : 'Submit Review'}
        </button>
      </form>

      <div className="mt-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">All Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No reviews yet. Be the first!
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              // 🔥 compute ownership here
              const isOwnReview = currentUser?.id === rev.author?._id;
              return (
                <div
                  key={rev._id}
                  className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition duration-300"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-gray-800">
                      @{rev.author?.username}
                    </p>
                    {isOwnReview && (
                      <button
                        type="button"        // <-- prevents form submission
                        onClick={() => handleDelete(rev._id)}
                        className="text-sm text-red-500 hover:text-red-700 transition duration-300"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <div className="flex items-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-xl ${
                          i < rev.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-700">{rev.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
