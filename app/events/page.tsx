import React from 'react';
import events from '../events'; // Adjust the path if necessary
import EventItem from '../components/EventItem'; // Adjust the path if necessary

const Events = () => {
  return (
    <div className='flex flex-col font-neue-display lg:mr-4 lg:ml-1 mt-4'>
      <div className='flex flex-col'>
        {events.map((event, index) => (
          <div key={index} id={`${index}`}>
            <EventItem
              flyer={event.flyer}
              flyerHover={event.flyerHover} // Pass the hover image prop
              title={event.title}
              location={event.location}
              date={event.date}
              description={event.description}
              eventLink={event.eventLink}
              isFirstEvent={index === 0} // Set true for the first event
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
