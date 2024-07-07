import { Request, Response } from 'express';
import Appointment from '../models/appointmentModel';
import User from '../models/userModel';
import Staff from '../models/staffModel';
import Service from '../models/serviceModel';


interface AuthRequest extends Request {
  params: any;
  body: { user: any; staff: any; services: any; date: any; };
  user?: any;
}

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { user, staff, services, date } = req.body;
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const existingAppointments = await Appointment.find({
      staff,
      date: { $eq: new Date(date) }
    });

    if (existingAppointments.length) {
      return res.status(400).send({ error: 'Staff is not available at the selected time' });
    }

    const appointment = new Appointment({
      user: req.user._id,
      staff,
      services,
      date,
      status: 'booked',
      totalPrice: await calculateTotalPrice(services)
    });

    await appointment.save();
    res.status(201).send(appointment);
  } catch (error) {
    res.status(400).send(error);
  }
};





export const createAppointmentWithoutStaff = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { services, date } = req.body;

    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const newAppointment = new Appointment({
      user: user.userId, // Ensure this is the correct field
      services,
      date,
      totalPrice: await calculateTotalPrice(services)
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Could not create appointment', details: error.message });
  }
};

const calculateTotalPrice = async (services: string[]) => {
  let totalPrice = 0;
  for (const serviceId of services) {
    const service = await Service.findById(serviceId);
    if (service) {
      totalPrice += service.price;
    }
  }
  return totalPrice;
};


export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ user: user._id });
    res.send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    appointment.status = 'cancelled';
    await appointment.save();
    res.send(appointment);
  } catch (error) {
    res.status(500).send(error);
  }
};
