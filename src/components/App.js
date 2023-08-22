import React, { useState } from "react";

import Filters from "./Filters";
import PetBrowser from "./PetBrowser";

function App() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({ type: "all" });

  const onChangeType = (typeValue) => {
    setFilters({ ...filters, type: typeValue })
  };

  const onFindPetsClick = () => {
    if (filters.type === "all") {
      fetch("http://localhost:3001/pets")
      .then(r => r.json())
      .then(pets => setPets(pets))
    } else {
      fetch(`http://localhost:3001/pets?type=${filters.type}`)
        .then(r => r.json())
        .then(selectPets => setPets(selectPets))
    };
  };

  const onAdoptPet = (petID) => {

    const matchedObj = pets.find(pet => {
      return petID === pet.id;
    });
    
    fetch(`http://localhost:3001/pets/${petID}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ ...matchedObj, isAdopted: true })
    })
      .then(r => r.json())
      .then(updatedObj => {
        const updatedPetList = pets.map(oldObj => {
          if (updatedObj.id === oldObj.id) {
            return updatedObj;
          } else return oldObj;
        });

        setPets(updatedPetList);
      });
      
  };

  return (
    <div className="ui container">
      <header>
        <h1 className="ui dividing header">React Animal Shelter</h1>
      </header>
      <div className="ui container">
        <div className="ui grid">
          <div className="four wide column">
            <Filters
              onChangeType={onChangeType}
              onFindPetsClick={onFindPetsClick}
            />
          </div>
          <div className="twelve wide column">
            <PetBrowser 
              pets={pets}
              onAdoptPet={onAdoptPet}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;