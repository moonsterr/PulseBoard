import { MdDashboard } from 'react-icons/md';
import DashboardHeading from '../components/dashboardHeading';
import SceneButton from '../components/SceneButtons';
import Scene from '../components/Scene';
import { useOutletContext, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useEffect, useState } from 'react';

function Collection() {
  // coming from the parent route (Dashboard layout)
  const { collectionData, data, loading: parentLoading } = useOutletContext();
  const { id } = useParams();

  const [currentCollection, setCurrentCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionData || collectionData.length === 0) return;

    const found = collectionData.find((c) => String(c.id) === String(id));
    setCurrentCollection(found || null);
    setLoading(false);
  }, [collectionData, id]);

  // Combine local loading + parent loading
  if (loading || parentLoading) {
    return (
      <div className="dashboard-page">
        <Spinner />
      </div>
    );
  }

  // Filter canvases that belong to this collection
  const filteredScenes = data?.filter(
    (scene) => String(scene.collection_id) === String(id)
  );

  return (
    <div className="dashboard-page">
      <DashboardHeading
        iconImg={MdDashboard}
        heading={currentCollection?.name || 'Collection'}
      />
      <SceneButton />
      <div className="dashboard-scenes">
        <div className="dashboard-scenes-header">
          <h2>Canvases</h2>
        </div>

        <div className="scenes-container">
          {parentLoading ? (
            <Spinner />
          ) : filteredScenes && filteredScenes.length > 0 ? (
            filteredScenes.map((scene) => (
              <Scene key={scene.id} canvas={scene} />
            ))
          ) : (
            <p>No scenes available for this collection.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Collection;
