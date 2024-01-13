import { ToastContainer } from "react-toastify";
import Navigation from "./navigation/index";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navigation />
      <ToastContainer />
    </>
  );
}

export default App;
