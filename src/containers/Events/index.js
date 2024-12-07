import { useState, useEffect } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);

  useEffect(() => {
    if (!data?.events) return;
    const filteredEventsAll = data.events.filter(
      (event) => !type || event.type === type
    );
    console.log("Filtered Events:", filteredEventsAll);

    const paginatedEvents = filteredEventsAll.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE
    );
    setFilteredEvents(paginatedEvents);
    setPageNumber(Math.ceil(filteredEventsAll.length / PER_PAGE));
  }, [data, type, currentPage]);

  const changeType = (evtType) => {
    console.log("Selected Type:", evtType);
    setType(evtType || null);
    setCurrentPage(1); // Reset to the first page when the type changes
  };

  const typeList = data?.events
    ? Array.from(new Set(data.events.map((event) => event.type)))
    : [];

  if (error) return <div>An error occurred</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select
        selection={typeList}
        onChange={(value) => changeType(value)}
      />
      <div id="events" className="ListContainer">
        {filteredEvents.map((event) => (
          <Modal key={event.id} Content={<ModalEvent event={event} />}>
            {({ setIsOpened }) => (
              <EventCard
                onClick={() => setIsOpened(true)}
                imageSrc={event.cover}
                title={event.title}
                date={new Date(event.date)}
                label={event.type}
              />
            )}
          </Modal>
        ))}
      </div>
      <div className="Pagination">
        {[...Array(pageNumber)].map((_, n) => (
          <a
            key={`page-${n}`} // Fixed the unique key warning
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(n + 1);
            }}
          >
            {n + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;

