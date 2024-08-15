import React from 'react'
import events from '../events'
import EventItem from '../components/EventItem'

const Events = () => {
  return (
    <div className='flex flex-col font-neue-display lg:mr-4 lg:ml-1'>
      <h3 className="-tracking-wide text-base mb-2 ml-1">Eventos</h3>
      <div className='flex flex-col'>
        {events.map((event, index) => (
          <div key={index} id={`${index}`}>
            <EventItem
              flyer={event.flyer}
              title={event.title}
              location={event.location}
              date={event.date}
              description={event.description}
              eventLink={event.eventLink}
              />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Events