import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { GEO_API_URL, geoApiOptions } from "./api-endpoints";
import { City } from "./types";
import { SingleValue } from "react-select";

type SelectOption = {
  value: string;
  label: string;
};

const Search = () => {
  const [search, setSearch] = useState<SelectOption>();

  const loadOptions = async (inputValue: string): Promise<{ options: SelectOption[] }> => {
    console.log("inputValue:", inputValue);
    if (!inputValue || inputValue.length === 0) return { options: [] };
    // change this to async await, with try catch
    return fetch(`${GEO_API_URL}/cities?minPopulation=1000000&namePrefix=${inputValue}`, geoApiOptions)
      .then((response) => response.json())
      .then((response) => {
        return {
          options: response.data.map((city: City) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            };
          }),
        };
      });
  };

  const handleOnChange = (searchData: SingleValue<SelectOption>) => {
    if (!searchData) return;
    console.log("searchData:", searchData);
    setSearch(searchData);
  };

  return (
    <AsyncPaginate
      placeholder="Search for city"
      debounceTimeout={600}
      value={search}
      onChange={handleOnChange}
      loadOptions={loadOptions}
    />
  );
};

export default Search;
