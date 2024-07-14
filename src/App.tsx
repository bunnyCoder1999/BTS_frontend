import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookingList from "./pages/BookingsList";
import CreateBooking from "./pages/CreateBooking";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<BookingList />} />
				<Route path="/create" element={<CreateBooking />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
