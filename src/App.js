import { useEffect, useState, useRef } from "react";
const zoomStep = 20;
const App = () => {
  const ref = useRef();
  const [videoZoom, setVideoZoom] = useState(200);

  useEffect(() => {
    function zoomIn() {
      // dont name single functions in caps, use camelcase
      setVideoZoom((current) => current + zoomStep);
    }
    function zoomOut() {
      // dont name single functions in caps, use camelcase
      setVideoZoom((current) => current - zoomStep);
    }
    function handleKeyDown(e) {
      console.log(e.key);
      if (e.key === "+") {
        zoomIn();
      }
      if (e.key === "-") {
        zoomOut();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={ref}>
      <video loop autoPlay={true} width={videoZoom}>
        <source src="vid.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default App;
