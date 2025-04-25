import { Request } from "@hapi/hapi";
import { EventService } from "../services/event.service";
import { IEventDocument } from "../models/event.model";
const EventController = {
  createNewEvent(request: Request) {
    try {
      const eventInfo = request.payload as IEventDocument;
      return EventService.createEvent(eventInfo);
    } catch (error) {
      console.log(error);
    }
  },

  getOneEvent(eventId: string) {
    try {
      return EventService.getEventById(eventId);
    } catch (error) {
      console.log(error);
    }
  },

  getEvents(request: Request) {
    try {
      const eventInfo = request.query as Partial<IEventDocument>;
      const page = request.query.page as number;
      return EventService.getEvents(page, eventInfo);
    } catch (error) {
      console.log(error);
    }
  },

  updateEvent(request: Request) {
    try {
      const eventInfo = request.payload as IEventDocument;
      const eventId = request.params._id;
      return EventService.updateEvent(eventId, eventInfo);
    } catch (error) {
      console.log(error);
    }
  },

  deleteEventById(eventId: string) {
    try {
      return EventService.deleteEventById(eventId);
    } catch (error) {
      console.log(error);
    }
  },

  updateTeachingCourse(eventId: string) {
    try {
      return EventService.generateNewVoucher(eventId);
    } catch (error) {
      console.log(error);
    }
  },
};
export default EventController;
