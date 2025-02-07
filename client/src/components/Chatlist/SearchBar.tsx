import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
function SearchBar() {
  const {
    state: { contactSearch },
    dispatch,
  } = useStateProvider();

  return (
    <div className="bg-search-input-container-background flex items-center py-3 pl-5 gap-3 h-14">
      <div className="bg-panel-header-background flex flex-grow items-center gap-5 px-3 py-1 rounded-lg">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
        </div>
        <div className="w-full">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-white w-full text-sm focus:outline-none "
            value={contactSearch}
            onChange={(e) =>
              dispatch({
                type: reducerCases.SET_CONTACT_SEARCH,
                contactSearch: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BsFilter className="text-panel-header-icon cursor-pointer text-lg" />
      </div>
    </div>
  );
}

export default SearchBar;
