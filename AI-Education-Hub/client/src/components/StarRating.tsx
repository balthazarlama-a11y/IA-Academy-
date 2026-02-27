import { Star } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  onChange?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  readOnly = true,
  onChange 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-8 h-8"
  };

  const handleMouseEnter = (index: number) => {
    if (!readOnly) setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!readOnly) setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!readOnly && onChange) onChange(index);
  };

  const displayRating = hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="flex items-center gap-1" onMouseLeave={handleMouseLeave}>
      {[...Array(maxRating)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = displayRating >= starValue;
        const isHalf = displayRating > i && displayRating < starValue;

        return (
          <motion.button
            key={i}
            type="button"
            disabled={readOnly}
            whileHover={!readOnly ? { scale: 1.2 } : {}}
            whileTap={!readOnly ? { scale: 0.9 } : {}}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onClick={() => handleClick(starValue)}
            className={`
              relative flex items-center justify-center transition-colors
              ${readOnly ? "cursor-default" : "cursor-pointer"}
              ${isFilled || isHalf ? "text-accent" : "text-white/10"}
            `}
          >
            <Star 
              className={`${sizeClasses[size]} ${isFilled ? "fill-current" : ""}`} 
              strokeWidth={isFilled ? 0 : 2}
            />
            {isHalf && (
              <div className="absolute inset-0 overflow-hidden w-[50%]">
                <Star className={`${sizeClasses[size]} fill-accent text-accent`} strokeWidth={0} />
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
