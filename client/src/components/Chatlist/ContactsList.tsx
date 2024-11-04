import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";

import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import { setContactPage } from "@/store/reducers/userSlice";

import ChatListItem from "./ChatListItem";

function ContactsList() {
  const dispatch = useDispatch();
  const [allContacts, setAllContacts] = useState([]);

  useEffect(() => {
    async function getContacts() {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);
        setAllContacts(users);
        console.log(users);
      } catch (err) {
        console.log(err);
      }
    }
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          <BiArrowBack onClick={() => dispatch(setContactPage())} />
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className="flex py-3 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow mx-4">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
            </div>
            <div className="w-full">
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent p-2 text-sm focus:outline-none text-white w-full"
              />
            </div>
          </div>
        </div>
        {Object.entries(allContacts).map(
          ([initialLetter, userList]: [
            initialLetter: string,
            userList: IUserProfile[]
          ]) => (
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
              {userList.map((contact) => (
                <ChatListItem
                  key={contact.id}
                  data={contact}
                  isContactPage={true}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ContactsList;
