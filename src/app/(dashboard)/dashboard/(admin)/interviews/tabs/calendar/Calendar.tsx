// * React Imports
import React, { useState } from "react";

// * MUI Imports
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

// * Full Calendar Imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";

import AddEvent from "./AddEvent";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}
const Calendar = () => {
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
  });
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [allEvent, setAllEvents] = useState<Event[]>([]);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setShowAddModal(true);

    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent,
      start: data.date.toISOString(),
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime(),
    };
  }

  const handleCloseModal = () => setShowAddModal(!showAddModal);

  function handleDeleteModal(data: { event: { id: string } }) {
    // setModal
    // setIdToDelete(Number(data.event.id))
  }

  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          headerToolbar={{
            start: "prev,next",
            center: "title",
            end: "timeGridWeek,dayGridMonth,timeGridDay",
          }}
          views={{
            week: {
              titleFormat: {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            },
          }}
          events={{}}
          initialView="dayGridMonth"
          nowIndicator={true}
          editable={true}
          droppable={true}
          selectable={true}
          selectMirror={true}
          dateClick={handleDateClick}
          drop={(data) => addEvent(data)}
          // eventClick={(data) => handleDeleteModal(data)} //handle event delete
        />
      </Box>
      <AddEvent open={showAddModal} close={handleCloseModal} />
    </>
  );
};

export default Calendar;
