/* eslint-disable react/prop-types */
import "./BannerCard.css";
import "./BannerGrid.jsx";

export default function BannerCard({ image, category, title, subtitle }) {
  return (
    <div className="banner-card">
      <img src={image} alt={title} className="banner-img" />

      <div className="banner-text">
        {category && <span className="banner-category">{category}</span>}
        <h3 className="banner-title2">{title}</h3>
        {subtitle && <p className="banner-subtitle2">{subtitle}</p>}
      </div>
    </div>
  );
}
