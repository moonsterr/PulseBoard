import {
  FaExclamationTriangle,
  FaInfoCircle,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa';
import './Banner.css';
const iconMap = {
  success: FaCheckCircle,
  neutral: FaInfoCircle,
  error: FaTimesCircle,
  warning: FaExclamationTriangle,
};

export default function Banner({
  type = 'neutral',
  heading = 'Update',
  description,
}) {
  const Icon = iconMap[type];

  return (
    <div className={`banner banner-${type}`}>
      <div className="banner-heading">
        <Icon className="icon" />
        <h2>{heading}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
