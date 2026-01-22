import { useState } from "react";
import "./App.css";
import { coffeeList } from "./coffeeData";

// Функция для получения флага страны
const getCountryFlag = (country: string): string => {
  const countryFlags: Record<string, string> = {
    Thailand: "🇹🇭",
    Brazil: "🇧🇷",
    Colombia: "🇨🇴",
    Guatemala: "🇬🇹",
    Ethiopia: "🇪🇹",
    Honduras: "🇭🇳",
    "Papua New Guinea": "🇵🇬",
    "Costa Rica": "🇨🇷",
    Peru: "🇵🇪",
    Panama: "🇵🇦",
  };
  return countryFlags[country] || "🏳️";
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCoffee = coffeeList.filter(
    (coffee) =>
      coffee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coffee.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="app">
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск кофе..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      <div className="cards-container">
        {filteredCoffee.length > 0 ? (
          filteredCoffee.map((coffee) => (
            <div key={coffee.id} className="coffee-card">
              <div className="flag-icon">{getCountryFlag(coffee.country)}</div>
              <h3>{coffee.name}</h3>
              <p>{coffee.description}</p>
            </div>
          ))
        ) : (
          <div className="no-results">Ничего не найдено</div>
        )}
      </div>
    </div>
  );
}

export default App;
