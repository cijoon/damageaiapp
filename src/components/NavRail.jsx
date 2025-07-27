// src/components/NavRail.jsx
import './NavRail.css';

export default function NavRail() {
  const items = ["intro", "case-studies", "experiments"];
  return (
    <nav className="nav-rail">
      {items.map((id) => (
        <a key={id} href={`#${id}`} className="rail-link">
          {id.replace("-", " ")}
        </a>
      ))}
    </nav>
  );
}