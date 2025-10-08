import { MdDashboard } from 'react-icons/md';
import DashboardHeading from '../components/dashboardHeading';
import SceneButton from '../components/SceneButtons';
import Scene from '../components/Scene';
import { useOutletContext } from 'react-router-dom';
import Spinner from '../components/Spinner';
function Dashboard() {
  const { data, loading } = useOutletContext();
  return (
    <div className="dashboard-page">
      <DashboardHeading
        iconImg={MdDashboard}
        heading={'Dashboard'}
        description={'This is the dashboard'}
        button={'Activity:'}
      />
      <SceneButton />
      <div className="dashboard-scenes">
        <div className="dashboard-scenes-header">
          <h2>Scenes</h2>
        </div>
        <div className="scenes-container">
          {loading && <Spinner />}
          {data?.length && !loading > 0 ? (
            data.map((canvas_) => {
              console.log(canvas_);
              return <Scene key={canvas_.id} canvas={canvas_} />;
            })
          ) : (
            <p>No scenes available</p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
