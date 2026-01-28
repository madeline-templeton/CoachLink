import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebase";
import Dropdown, { Option } from "./components/Dropdown";
import DatePicker from "./components/DatePicker";
import LocationSelector, { LocationValue } from "./components/LocationSelector";
import Button from "./components/Button";
import "./styles.css";

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [selection, setSelection] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [location, setLocation] = useState<LocationValue>({
    state: "",
    city: "",
  });
  const [searching, setSearching] = useState(false);
  const sportOptions: Option[] = [
    { label: "Select a sport", value: "", disabled: true },
    { label: "Tennis", value: "tennis" },
    { label: "Soccer", value: "soccer" },
    { label: "Basketball", value: "basketball" },
  ];
  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);
  return (
    <div className="app">
      <h1>CoachLink</h1>
      <p>{user ? `Signed in as ${user.email}` : "Not signed in"}</p>
      <div style={{ marginTop: 16 }}>
        <Dropdown
          label="Choose a sport"
          options={sportOptions}
          value={selection}
          onChange={setSelection}
        />
        {selection && <p style={{ marginTop: 8 }}>Selected: {selection}</p>}
      </div>
      <div style={{ marginTop: 16 }}>
        <DatePicker
          label="Select a date"
          value={selectedDate}
          onChange={setSelectedDate}
        />
        {selectedDate && <p style={{ marginTop: 8 }}>Date: {selectedDate}</p>}
      </div>
      <div style={{ marginTop: 16 }}>
        <LocationSelector
          label="Select location"
          value={location}
          onChange={setLocation}
        />
        {location.state && location.city && (
          <p style={{ marginTop: 8 }}>
            Location: {location.city}, {location.state}
          </p>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <Button
          loading={searching}
          onClick={async () => {
            setSearching(true);
            // Placeholder: in the future we will call backend to fetch sessions
            // using current filters: selection (sport), selectedDate, location
            console.log("Find sessions with:", {
              sport: selection,
              date: selectedDate,
              location,
            });
            await new Promise((r) => setTimeout(r, 800));
            setSearching(false);
            alert(
              "Session search not implemented yet.\nCheck console for payload.",
            );
          }}
        >
          find sessions for me
        </Button>
      </div>
    </div>
  );
}
