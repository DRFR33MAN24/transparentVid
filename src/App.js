import { useEffect, useState, useRef } from "react";
const zoomStep = 20;
const maxZoom = 1500;
const minZoom = 150;
const App = () => {
  const ref = useRef();

  const [videoZoom, setVideoZoom] = useState(() => {
    if (JSON.parse(localStorage.getItem("videoZoom"))) {
      return JSON.parse(localStorage.getItem("videoZoom"));
    } else {
      return 200;
    }
  });

  useEffect(() => {
    localStorage.setItem("videoZoom", JSON.stringify(videoZoom));
  }, [videoZoom]);

  useEffect(() => {
    function zoomIn() {
      // dont name single functions in caps, use camelcase
      setVideoZoom((current) => {
        const zoom = current + zoomStep;
        if (zoom >= maxZoom) {
          return maxZoom;
        }
        return zoom;
      });
    }
    function zoomOut() {
      // dont name single functions in caps, use camelcase
      setVideoZoom((current) => {
        const zoom = current - zoomStep;
        if (zoom <= minZoom) {
          return minZoom;
        }
        return zoom;
      });
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
    <div ref={ref} className="App">
      <video loop autoPlay={true} width={videoZoom} className="video">
        <source src="vid.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default App;
