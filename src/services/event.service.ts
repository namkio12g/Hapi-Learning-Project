import Boom from "@hapi/boom";
import {
  CourseModel,
  EventModel,
  IEventDocument,
  VoucherModel,
} from "../models/index";
import mongoose from "mongoose";
import { randomBytes } from "crypto";

const LIMIT_NUMBER = 6;
export const EventService = {
  async createEvent(eventInfo: IEventDocument) {
    if (eventInfo.timeEnd && new Date(eventInfo.timeEnd) < new Date()) {
      throw Boom.badRequest("The end time cannot be before the start time");
    }
    const newVoucherCode: string = randomBytes(4).toString("hex");
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const newEvent = new EventModel(eventInfo);
      const newEventSaved = await newEvent.save({ session });
      const newVoucher = await VoucherModel.create(
        [
          {
            code: newVoucherCode,
            quantity: newEventSaved.maxVoucherQuantity,
            eventApplied: newEventSaved._id,
          },
        ],
        { session }
      );
      const eventObj = await EventModel.findByIdAndUpdate(
        newEvent._id,
        {
          $set: { voucher: newVoucher[0]._id },
        },
        { new: true, session }
      ).populate("voucher", "_id code");
      await session.commitTransaction();
      return eventObj;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw Boom.badRequest("Had Error at creating event");
    } finally {
      session.endSession();
    }
  },

  async generateNewVoucher(eventId: string) {
    const eventObj = await EventModel.findById(eventId);
    if (!eventObj) throw Boom.notFound("Can't found the event");
    const voucherObj = await VoucherModel.findById(eventObj.voucher);
    const newVoucherCode: string = randomBytes(4).toString("hex");
    const session = await mongoose.startSession();

    try {
      session.startTransaction();
      const newVoucher = await VoucherModel.create(
        [
          {
            code: newVoucherCode,
            quantity: eventObj.maxVoucherQuantity,
            eventApplied: eventObj._id,
          },
        ],
        { session }
      );
      if (voucherObj) {
        voucherObj.eventApplied = undefined;
        await voucherObj.save({ session });
      }
      const updatedEventObj = await EventModel.findByIdAndUpdate(
        eventId,
        {
          $set: { voucher: newVoucher[0]._id },
        },
        { session }
      ).populate("voucher", "_id code");
      await session.commitTransaction();
      return updatedEventObj;
    } catch (error) {
      await session.abortTransaction();
      throw Boom.badRequest(
        "Had Error at generating new voucher for the event"
      );
    } finally {
      session.endSession();
    }
  },

  async deleteEventById(eventId: string) {
    try {
      return await EventModel.deleteOne({ _id: eventId });
    } catch (error) {
      throw Boom.badRequest("Had an error at deleting event");
    }
  },
  async addCourseToEvent(eventId: string, courseIdArray: string[]) {
    const eventObj = await EventModel.findById(eventId);
    if (!eventObj) throw Boom.notFound("Can't found the event");
    try {
      for (const item of courseIdArray) {
        const isExisted = eventObj.coursesEligible?.includes(
          new mongoose.Types.ObjectId(item)
        );
        if (!isExisted) {
          eventObj.coursesEligible?.push(new mongoose.Types.ObjectId(item));
        }
      }
      return await eventObj.save();
    } catch (error) {
      throw Boom.badRequest("Had an error at adding courses to th event");
    }
  },

  async updateEvent(eventId: string, eventInfo: Partial<IEventDocument>) {
    const eventObj = await EventModel.findById(eventId);
    if (!eventObj) throw Boom.notFound("event not found");
    const timeStart = eventObj.timeStart;
    if (
      eventInfo.timeEnd &&
      timeStart &&
      new Date(eventInfo.timeEnd) < timeStart
    )
      throw Boom.badRequest("The end time cannot be before the start time");

    try {
      const updatedEventObj = await EventModel.findByIdAndUpdate(
        eventId,
        { $set: eventInfo },
        { new: true, runValidators: true }
      );
      if (!updatedEventObj) throw Boom.notFound("Event not found");
      return updatedEventObj;
    } catch (error) {
      throw Boom.badRequest("Had an error at updating event");
    }
  },

  async getEventById(eventId: string) {
    try {
      const res = await EventModel.findOne({ _id: eventId })
        .populate("coursesEligible", "_id name")
        .populate("voucher", "_id code");
      if (!res) throw Boom.notFound("Event not found");
      return res;
    } catch (error) {
      throw Boom.badRequest("Had an error at finding event");
    }
  },

  async getEvents(page: number, eventQuery: Partial<IEventDocument>) {
    try {
      let query: any = {
        name: { $regex: eventQuery.name, $options: "i" },
        active: { $regex: eventQuery.active, $options: "i" },
      };
      if (eventQuery.timeStart)
        query.timeStart = { $gte: new Date(eventQuery.timeStart) };
      if (eventQuery.timeEnd)
        query.timeEnd = { $lte: new Date(eventQuery.timeEnd) };
      if (eventQuery.discount) query.discount = { $lte: eventQuery.discount };
      const eventArr = await EventModel.find(query)
        .skip((page - 1) * LIMIT_NUMBER)
        .limit(LIMIT_NUMBER);
      return eventArr;
    } catch (error) {
      throw Boom.badRequest("Had an error at getting events");
    }
  },
};
