import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookingList from "./pages/BookingsList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BookingList />} />
        <Route path="/create" element={<div>Create booking</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
