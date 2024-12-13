
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

    // Filtrer par type avant la pagination
    const filteredEventsAll = data.events.filter(
      (event) => !type || event.type === type
    );

    const paginatedEvents = filteredEventsAll.slice(
      (currentPage - 1) * PER_PAGE,
      currentPage * PER_PAGE
    );

    setFilteredEvents(paginatedEvents);
    setPageNumber(Math.ceil(filteredEventsAll.length / PER_PAGE));
  }, [data, type, currentPage]);

  const changeType = (evtType) => {
    setType(evtType || null);
    setCurrentPage(1); // Réinitialiser à la première page lorsque le type change
  };

  const typeList = data?.events
    ? Array.from(new Set(data.events.map((event) => event.type)))
    : [];

  if (error) return <div>An error occurred</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
      <h3 className="SelectTitle">Catégories</h3>
      <Select selection={typeList} onChange={(value) => changeType(value)} />
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
        {[...Array(pageNumber)].map((_, index) => (
          <a
            key={`pagination-page-${index}`}
            href="#events"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(index + 1);
            }}
          >
            {index + 1}
          </a>
        ))}
      </div>
    </>
  );
};

export default EventList;

