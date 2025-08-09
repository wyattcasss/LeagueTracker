function ChampionCard({ imageUrl, title, description, category }) {
  return (
    <div className="champion-card">
      <div className="card-header">
        <div className="card-image">
          <img src={imageUrl} alt={title} />
        </div>
        <h3 className="champion-name">{title}</h3>
      </div>
      <div className="card-content">
        <p>{description}</p>
        <div className="category-button">{category}</div>
      </div>
    </div>
  );
}
export default ChampionCard;