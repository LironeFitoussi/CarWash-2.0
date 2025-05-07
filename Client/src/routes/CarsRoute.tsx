import { useState } from "react";
import axios from "axios";
import { transliterate } from "hebrew-transliteration";

interface CarInfo {
  tozeret_nm: string;
  kinuy_mishari: string;
  shnat_yitzur: string;
  mispar_rechev: string;
}

export default function CarsRoute() {
  const [carNumber, setCarNumber] = useState("1234567");
  const [carInfo, setCarInfo] = useState<CarInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const manufacturerMap: Record<string, string> = {
    שברולט: "Chevrolet",
    טויוטה: "Toyota",
    יונדאי: "Hyundai",
    פורד: "Ford",
    מאזדה: "Mazda",
    מזדה: "Mazda",
    מרצדס: "Mercedes",
    "ב.מ.וו": "BMW",
    וולוו: "Volvo",
    פולקסווגן: "Volkswagen",
    קיה: "Kia",
    סובארו: "Subaru",
    "פיג'ו": "Peugeot",
    סיטרואן: "Citroën",
    אאודי: "Audi",
    רנו: "Renault",
    ניסאן: "Nissan",
    הונדה: "Honda",
    סקודה: "Skoda",
    פורשה: "Porsche",
    אלפא: "Alfa Romeo",
    "ג'יפ": "Jeep",
    
  };

  const fetchCarByNumber = async (number: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://data.gov.il/api/3/action/datastore_search",
        {
          params: {
            resource_id: "053cea08-09bc-40ec-8f7a-156f0677aff3", // Israeli cars DB
            q: number,
          },
        }
      );

      const records = response.data.result.records;
      if (records && records.length > 0) {
        setCarInfo(records[0]);
      } else {
        setCarInfo(null);
        setError("No car found with that number.");
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCarByNumber(carNumber);
  };

  const handleSaveCar = async () => {
    if (!carInfo) return;

    const payload = {
      manufacturer: normalizeManufacturer(carInfo.tozeret_nm),
      model: normalizeModel(carInfo.kinuy_mishari, carInfo.tozeret_nm),
      year: carInfo.shnat_yitzur,
      mispar_rechev: carInfo.mispar_rechev,
    };

    try {
      await axios.post("/api/cars", payload);
      alert("Car saved successfully!");
    } catch (error) {
      console.error("Error saving car:", error);
      alert("Failed to save car.");
    }
  };

  function normalizeManufacturer(rawName: string): string {
    const cleanName = rawName.trim();

    // Extract the first word from the string
    const firstWord = cleanName.split(" ")[0];
    return (
      manufacturerMap[firstWord] || cleanName.toUpperCase() // fallback: just return uppercase
    );
  }

  // Helper to check if a string contains Hebrew characters
  function containsHebrew(text: string): boolean {
    return /[\u0590-\u05FF]/.test(text);
  }

  function normalizeModel(rawModel: string, rawManufacturer: string): string {
    // If model is already in Latin, use as-is
    if (!containsHebrew(rawModel)) {
      return rawModel.trim();
    }
    // If model and manufacturer are the same after conversion, use the rest of the words after manufacturer as the model
    const manufacturerFirstWord = rawManufacturer.trim().split(" ")[0];
    const modelWords = rawModel.trim().split(" ");
    if (modelWords[0] === manufacturerFirstWord && modelWords.length > 1) {
      // Grab the rest of the words after the manufacturer
      const rest = modelWords.slice(1).join(" ");
      return transliterate(rest).trim() || transliterate(rawModel);
    }
    return transliterate(rawModel);
  }

  function buildGoogleImagesSearchURL(
    manufacturer: string,
    model: string,
    year?: string
  ) {
    const query = encodeURIComponent(
      `${manufacturer} ${model} ${year || ""}`.trim()
    );
    return `https://www.google.com/search?tbm=isch&q=${query}`;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Search Car by Number</h1>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          value={carNumber}
          onChange={(e) => setCarNumber(e.target.value)}
          placeholder="Enter license number (e.g. 1234567)"
          className="border px-3 py-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {carInfo && (
        <div className="border rounded p-4 shadow mt-4 space-y-2">
          <p>
            <strong>Manufacturer:</strong>{" "}
            {normalizeManufacturer(carInfo.tozeret_nm) || "N/A"}
          </p>
          <p>
            <strong>Model:</strong>{" "}
            {normalizeModel(carInfo.kinuy_mishari, carInfo.tozeret_nm) || "N/A"}
          </p>
          <p>
            <strong>Year:</strong> {carInfo.shnat_yitzur || "N/A"}
          </p>

          <a
            href={buildGoogleImagesSearchURL(
              normalizeManufacturer(carInfo.tozeret_nm),
              normalizeModel(carInfo.kinuy_mishari, carInfo.tozeret_nm),
              carInfo.shnat_yitzur
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            🖼️ View Images on Google
          </a>
          <button
            onClick={handleSaveCar}
            className="inline-block mt-2 ml-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
          >
            💾 Save to Database
          </button>
        </div>
      )}
    </div>
  );
}