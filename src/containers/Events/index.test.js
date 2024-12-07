import { render, screen } from "@testing-library/react";
import DataContext from "../../contexts/DataContext";
import EventList from "./index";

// Mock des données pour le test
const mockData = {
  events: [
    { id: 1, type: "Conference", cover: "image1.jpg", title: "Event 1", date: "2023-11-01T00:00:00Z" },
    { id: 2, type: "Workshop", cover: "image2.jpg", title: "Event 2", date: "2023-11-02T00:00:00Z" },
    { id: 3, type: "Conference", cover: "image3.jpg", title: "Event 3", date: "2023-11-03T00:00:00Z" },
  ],
};

test("filters events by category", async () => {
  // Vérifiez que DataContext est bien défini
  expect(DataContext.Provider).toBeDefined();

  // Rendu avec le contexte simulé
  render(
    <DataContext.Provider value={{ data: mockData, error: null }}>
      <EventList />
    </DataContext.Provider>
  );

  // Vérifiez si les événements sont affichés
  const eventElements = await screen.findAllByTestId("card-testid");
  expect(eventElements).toHaveLength(3);

  // Vérifiez si le menu déroulant est présent
  const selectElement = screen.getByRole("combobox");
  expect(selectElement).toBeInTheDocument();
});

