import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import List from "./List";
import ContactsList from "./ContactsList";
import { RootState } from "@/store/store";

function ChatList() {
  const contactsPage = useSelector(
    (state: RootState) => state.user.contactsPage
  );
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    contactsPage ? setPageType("all-contacts") : setPageType("default");
  }, [contactsPage]);

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}
    </div>
  );
}

export default ChatList;
