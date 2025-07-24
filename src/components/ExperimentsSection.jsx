// src/components/ExperimentsSection.jsx
import './ExperimentsSection.css'; // CSS dosyasını birazdan oluşturacağız

const experiments = [
  { id: 1, title: 'Milwaukee', image: '/images/Görüntü 1.07.2025 17.52 (1).jpg' },
  { id: 2, title: 'Makita', image: '/images/Görüntü 1.07.2025 17.47.jpg' },
  { id: 3, title: 'Snap-on', image: '/images/Görüntü 1.07.2025 17.52.jpg' },
  { id: 4, title: 'DeWalt', image: '/images/Görüntü 1.07.2025 17.52 (2).jpg' },
];

export default function ExperimentsSection() {
  return (
    <section id="experiments" className="experiments-section">
      <h2>Our Partners</h2>
      <div className="exp-grid">
        {experiments.map(exp => (
          <div key={exp.id} className="exp-card">
            <img src={exp.image} alt={exp.title} />
            <p>{exp.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}