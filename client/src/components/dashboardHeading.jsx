export default function DashboardHeading({
  iconImg: Icon,
  heading,
  description,
  button,
}) {
  return (
    <div className="dashboard-heading">
      <div className="text">
        <div className="text-logo">
          <Icon size={24} />
          <h1>{heading}</h1>
        </div>
        <p>{description}</p>
      </div>

      {button && <button className="dashboard-heading-btn">{button}</button>}
    </div>
  );
}
