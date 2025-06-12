import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { EventDetails } from '../types';

interface CalendarViewProps {
  events?: EventDetails[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ events = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const mockEvents: EventDetails[] = [
    {
      title: 'Community Meeting',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      time: '7:00 PM',
      description: 'Monthly community meeting to discuss upcoming projects',
      type: 'meeting'
    },
    {
      title: 'Maintenance Work',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: '9:00 AM',
      description: 'Elevator maintenance - Building A',
      type: 'task'
    },
    {
      title: 'Security Patrol',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      time: '10:00 PM',
      description: 'Night security patrol schedule',
      type: 'task'
    }
  ];

  const allEvents = [...events, ...mockEvents];

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'task':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <p className="text-gray-600 mt-1">
          Events automatically extracted from your messages
        </p>
      </div>
      
      <div className="p-6">
        {allEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No upcoming events found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {allEvents.map((event, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getEventTypeColor(event.type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                      {event.time && (
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{event.time}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-white rounded-full capitalize">
                    {event.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarView;