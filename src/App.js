import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login";
import OrderView from "./components/orderView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/order" element={<OrderView />} />
      </Routes>
    </Router>
  );
}

export default App;
