import { useState } from 'react';
import { X } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader.jsx';

const images = [
  { src: '/images/school-group.png', alt: 'Gurugram Public School group in front of campus' },
  { src: '/images/school-activity.png', alt: 'Students participating in school activity' },
  { src: '/images/sports-activity.png', alt: 'Students running on the school sports ground' },
  { src: '/images/campaign-group.png', alt: 'Road safety campaign by Gurugram Public School' }
];

export function GalleryPage() {
  const [previewImage, setPreviewImage] = useState(null);

  return (
    <section className="content-section page-pad">
      <SectionHeader eyebrow="Gallery" title="Campus life in motion">
        Photos, events, achievements, activity rooms, sports, culture, and learning moments.
      </SectionHeader>
      <div className="premium-masonry-gallery gallery-page-masonry">
        {images.map((image, index) => (
          <button key={image.src} type="button" className={`gallery-tile tile-${index + 1}`} onClick={() => setPreviewImage(image)}>
            <img src={image.src} alt={image.alt} />
          </button>
        ))}
      </div>
      {previewImage && (
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Gallery image preview" onClick={() => setPreviewImage(null)}>
          <button type="button" aria-label="Close gallery preview" onClick={() => setPreviewImage(null)}><X size={22} /></button>
          <img src={previewImage.src} alt={previewImage.alt} />
        </div>
      )}
    </section>
  );
}
