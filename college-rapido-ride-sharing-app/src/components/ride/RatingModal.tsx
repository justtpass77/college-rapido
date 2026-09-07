import { useState } from "react";
import Modal from "../common/Modal";
import StarRating from "../common/StarRating";
import Button from "../common/Button";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (stars: number, comment: string) => void;
  targetName: string;
}

export default function RatingModal({ isOpen, onClose, onSubmit, targetName }: RatingModalProps) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(stars, comment);
    setStars(5);
    setComment("");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Rate your ride with ${targetName}`}>
      <div className="flex flex-col items-center gap-4 py-2">
        <StarRating value={stars} onChange={setStars} size={32} />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave an optional comment about your ride..."
          rows={3}
          className="w-full rounded-2xl border border-gray-200 p-3 text-sm outline-none focus:border-[#FFC800] focus:ring-2 focus:ring-yellow-200"
        />
        <Button fullWidth onClick={handleSubmit}>
          Submit Rating
        </Button>
      </div>
    </Modal>
  );
}
