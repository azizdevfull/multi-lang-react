import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [languages, setLanguages] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("uz"); // Default language (Uzbek)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const languagesResponse = await fetch("http://localhost:3000/languages");
        const statusesResponse = await fetch("http://localhost:3000/statuses");
  
        if (!languagesResponse.ok || !statusesResponse.ok) {
          throw new Error("Failed to fetch data");
        }
  
        const languagesData = await languagesResponse.json();
        const statusesData = await statusesResponse.json();
  
        console.log("Raw Languages Data:", languagesData);
        console.log("Raw Statuses Data:", statusesData);
  
        // Check if data is wrapped or returned directly
        setLanguages(languagesData.languages || languagesData || []);
        setStatuses(statusesData.statuses || statusesData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const getTranslatedStatuses = () => {
    if (!statuses.length) return [];
    return statuses.map((status) => {
      const translation = status.translations.find(
        (t) => t.locale === selectedLanguage
      );
      return translation ? translation.name : status.name;
    });
  };

  const translatedStatuses = getTranslatedStatuses();
  console.log("Translated Statuses:", translatedStatuses);

  return (
    <div className="App">
      <h1>Language Dropdown with Translated Statuses</h1>

      {/* Language Dropdown */}
      {languages.length > 0 ? (
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {languages.map((language) => (
            <option key={language.id} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
      ) : (
        <p>Loading languages...</p>
      )}

      {/* Display Translated Statuses */}
      {statuses.length > 0 ? (
        <ul>
          {translatedStatuses.map((statusName, index) => (
            <li key={index}>{statusName}</li>
          ))}
        </ul>
      ) : (
        <p>Loading statuses...</p>
      )}
    </div>
  );
}

export default App;
