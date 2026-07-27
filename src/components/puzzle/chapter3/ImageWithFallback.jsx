import { useState } from 'react';
import { assetPath } from '../../../data/siteData.js';

export default function ImageWithFallback({ alt, className = '', src }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className={`journey-image-fallback ${className}`} aria-label={alt} role="img">
        {alt}
      </span>
    );
  }

  return <img src={assetPath(src)} alt={alt} className={className} onError={() => setFailed(true)} />;
}
