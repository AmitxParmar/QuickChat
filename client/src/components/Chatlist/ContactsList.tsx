import axios from "axios";
import { useState, useEffect } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import ChatListItem from "./ChatListItem";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";

function ContactsList() {
  const [allContacts, setAllContacts] = useState<Contact>({});
  const [searchContacts, setSearchContacts] = useState<Contact>({});
  const [searchTerm, setSearchTerm] = useState("");
  const { state, dispatch } = useStateProvider(); // Get userInfo from state

  useEffect(() => {
    const filteredData: Contact = {};
    // get all the keys of allContacts, example: Array ['A', 'B', 'C']
    Object.keys(allContacts).forEach((key) => {
      filteredData[key] =
        allContacts[key]?.filter((obj: IUserProfile) =>
          obj?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        ) || [];
    });
    setSearchContacts(searchTerm.length ? filteredData : allContacts);
  }, [searchTerm, allContacts]);

  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        setSearchContacts(users);
      } catch (err) {
        console.log(err);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center text-white gap-12">
          <BiArrowBack
            className="cursor-pointer text-xl"
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span>New chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background flex-auto h-full overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex flex-grow items-center gap-5 px-3 py-1 mx-4 rounded-lg">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-lg" />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-white w-full text-sm focus:outline-none "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              {searchTerm.length === 0 && (
                <div className="text-teal-light pl-10 py-5">
                  {initialLetter}
                </div>
              )}
              <div>
                {userList.map((contact) => {
                  // Prevent current user from clicking on their own contact
                  if (contact.id === state.userInfo?.id) return null;
                  return (
                    <ChatListItem
                      data={contact}
                      isContactsPage={true}
                      key={contact.id}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
