import { useEffect } from "react";
const App = () => {
  useEffect(() => {}, []);

  return (
    <div>
      <video loop autoPlay={true}>
        <source src="vid.webm" type="video/webm" />
      </video>
    </div>
  );
};

export default App;
