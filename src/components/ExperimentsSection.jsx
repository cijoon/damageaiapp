// src/components/ExperimentsSection.jsx
import './ExperimentsSection.css'; // CSS dosyasını birazdan oluşturacağız

const experiments = [
  { id: 1, title: 'Generative Patterns', image: '/images/Görüntü 1.07.2025 17.52 (1).jpg' },
  { id: 2, title: 'AI Video Synthesis', image: '/images/Görüntü 1.07.2025 17.47.jpg' },
  { id: 3, title: '3D Gaussian Splatting', image: '/images/Görüntü 1.07.2025 17.52.jpg' },
  { id: 4, title: 'Interactive Music', image: '/images/Görüntü 1.07.2025 17.52 (2).jpg' },
];

export default function ExperimentsSection() {
  return (
    <section id="experiments" className="experiments-section">
      <h2>Experiments & explorations</h2>
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