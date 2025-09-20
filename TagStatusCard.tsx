// 📄 components/TagStatusCard.tsx
import React from 'react';

interface TagStatusCardProps {
  status: 'intact' | 'opened';
  openedAt?: string;
  paoEndDate?: string;
}

const TagStatusCard: React.FC<TagStatusCardProps> = ({ status, openedAt, paoEndDate }) => {
  const cardClasses =
    status === 'intact'
      ? 'bg-green-100 text-green-800 border-green-400'
      : 'bg-red-100 text-red-800 border-red-400';

  const title = status === 'intact' ? 'Product is Intact' : 'Product is Opened';
  const description =
    status === 'intact'
      ? 'This product has not been opened yet.'
      : 'This product was opened on:';

  return (
    <div
      className={`p-6 rounded-lg border-l-4 shadow-md transition-all duration-300 ease-in-out ${cardClasses}`}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm mb-4">{description}</p>
      {status === 'opened' && openedAt && paoEndDate && (
        <div className="text-xs">
          <p className="font-semibold">Opened Date: {new Date(openedAt).toLocaleDateString()}</p>
          <p className="font-semibold mt-1">
            Use Before: {new Date(paoEndDate).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default TagStatusCard;
