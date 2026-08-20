import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { RatingStars } from '../common/RatingStars';
import { Star, CheckCircle2 } from 'lucide-react';

export const RatingModal = ({ isOpen, onClose, onSubmit, ride, loading = false }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen || !ride) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      rideId: ride.id,
      rating,
      comment,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rate Your Experience"
      subtitle={`How was your trip with ${ride.driver?.user?.firstName || 'your driver'}?`}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Score Selection */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-dark-900/80 border border-slate-800 space-y-2">
          <RatingStars
            rating={rating}
            interactive={true}
            onChange={setRating}
            size="lg"
          />
          <span className="text-xs font-bold text-amber-400">
            {rating === 5 ? 'Exceptional! ⭐⭐⭐⭐⭐' : rating === 4 ? 'Great Trip! ⭐⭐⭐⭐' : rating === 3 ? 'Good ⭐⭐⭐' : 'Needs Improvement'}
          </span>
        </div>

        {/* Feedback Comment */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
            Leave Feedback (Optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Tell us about the vehicle cleanliness, route, or driving quality..."
            className="w-full rounded-xl glass-input p-3 text-xs placeholder-slate-500 focus:outline-none resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" fullWidth onClick={onClose} type="button">
            Skip
          </Button>
          <Button variant="primary" fullWidth type="submit" loading={loading}>
            Submit Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RatingModal;
