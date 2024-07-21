import { Request, Response } from 'express';
import Appointment from '../models/appointmentModel';
import User from '../models/userModel';
import Staff from '../models/staffModel';
import Service from '../models/serviceModel'; // Import IService
import { AuthRequest } from '../middlewares/userAuthMiddleware';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

const calculateTotalPrice = async (services: string[]): Promise<number> => {
  let totalPrice = 0;
  for (const serviceId of services) {
    const service = await Service.findById(serviceId);
    if (service) {
      totalPrice += service.price;
    }
  }
  return totalPrice;
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  const { staff, services, date } = req.body;

  try {
    // Validate request body
    if (!staff || !services || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: 'Services must be an array with at least one service ID' });
    }

    // Validate staff existence
    const staffMember = await Staff.findById(staff);
    if (!staffMember) {
      return res.status(400).json({ error: 'Invalid staff ID' });
    }

    // Validate services existence
    const serviceIds = await Service.find({ '_id': { $in: services } });
    if (serviceIds.length !== services.length) {
      return res.status(400).json({ error: 'One or more services are invalid' });
    }

    // Validate date and time
    const appointmentDate = new Date(date);
    const currentDate = new Date();

    if (appointmentDate.getTime() <= currentDate.getTime()) {
      return res.status(400).json({ error: 'Appointment time must be in the future' });
    }

    // Calculate total price
    const totalPrice = await calculateTotalPrice(services);

    // Create appointment
    const appointment = new Appointment({
      user: req.user?.userId,
      staff,
      services,
      date: appointmentDate,
      totalPrice,
      status: 'booked'
    });

    const result = await appointment.save();

    // Retrieve user information
    const user = await User.findById(req.user?.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Retrieve staff name and service names
    const staffName = staffMember.name;
    const staffPhone = staffMember.phone;
    const serviceNames = await Service.find({ '_id': { $in: services } }).select('type').exec();
    const serviceNamesString = serviceNames.map(service => service.type).join(', ');

    // Send email to user
    const userMailOptions = {
      from: process.env.SENDER_EMAIL, // Sender address
      to: user.email, // Recipient email
      subject: 'Appointment Confirmation', // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hello ${user.username},</h2>
          <p>Your appointment has been booked successfully. Here are the details:</p>
          <ul>
            <li><strong>Staff:</strong> ${staffName}</li>
            <li><strong>Staff phone number:</strong> ${staffPhone}</li>
            <li><strong>Services:</strong> ${serviceNamesString}</li>
            <li><strong>Date:</strong> ${appointmentDate.toLocaleString()}</li>
            <li><strong>Total Price:</strong> ksh. ${totalPrice}</li>
          </ul>
          <p>We look forward to seeing you!</p>
          <p>Regards,<br>Royal Sheers Team</p>
        </div>
      ` // HTML body
    };

    // Send email to staff
    const staffMailOptions = {
      from: process.env.SENDER_EMAIL, // Sender address
      to: staffMember.email, // Staff email
      subject: 'New Appointment Scheduled', // Subject line
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hello ${staffName},</h2>
          <p>A new appointment has been scheduled. Here are the details:</p>
          <ul>
            <li><strong>User:</strong> ${user.username}</li>
            <li><strong>Customer phone number: ${user.phone}</strong></li>
            <li><strong>Services:</strong> ${serviceNamesString}</li>
            <li><strong>Date:</strong> ${appointmentDate.toLocaleString()}</li>
            <li><strong>Total Price:</strong> ksh. ${totalPrice}</li>
          </ul>
          <p>Please prepare accordingly.</p>
          <p>Regards,<br>Royal Sheers Team</p>
        </div>
      ` // HTML body
    };

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to send appointment confirmation email to user" });
      } else {
        console.log('User email sent: ' + info.response);
      }
    });

    transporter.sendMail(staffMailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to send appointment details email to staff" });
      } else {
        console.log('Staff email sent: ' + info.response);
      }
    });

    return res.status(201).json({
      message: 'Appointment created successfully',
      appointment: result
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
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




export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const appointments = await Appointment.find({ user: user.userId }).populate('services').populate('staff');
    res.send(appointments);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getAppointmentById = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!req.user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }
    const appointment = await Appointment.findById(req.params.id).populate('services').populate('staff');
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }
    res.send(appointment);
  } catch (error) {
    res.status(500).send(error);
  }
}



const sendCancellationEmail = async (userEmail: string, userName: string, appointmentDate: Date) => {
  const cancellationMessage = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>Hello ${userName},</h2>
      <p>We regret to inform you that your appointment scheduled for ${appointmentDate.toLocaleString()} has been cancelled.</p>
      <p>If you have any questions or need to reschedule, please contact us.</p>
      <p>We apologize for any inconvenience this may cause and look forward to serving you in the future.</p>
      <p>Best regards,<br>Royal Sheers Team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.SENDER_EMAIL, // Sender address
    to: userEmail, // Recipient email
    subject: 'Appointment Cancellation', // Subject line
    html: cancellationMessage, // HTML body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Cancellation email sent to:', userEmail);
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
  }
};

export const cancelAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const appointment = await Appointment.findById(req.params.id).populate('user');
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    if (appointment.status !== "booked") {
      return res.status(400).send({ error: 'Cannot cancel an appointment in progress' });
    }

    if (appointment.user._id.toString() !== user.userId.toString()) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    // Send cancellation email to the user
    const userRecord = await User.findById(user.userId);
    if (userRecord) {
      await sendCancellationEmail(userRecord.email, userRecord.username, appointment.date);
    }

    res.send({ message: 'Appointment cancelled successfully', appointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).send({ error: 'An error occurred while cancelling the appointment' });
  }
};




export const completeAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    if (appointment.user.toString() !== user.userId) {
      return res.status(403).send({ error: 'Forbidden' });
    }

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    // Retrieve user information
    const userRecord = await User.findById(user.userId);
    if (!userRecord) {
      return res.status(404).send({ error: 'User not found' });
    }

    // Send thank-you message to the user
    const thankYouMessage = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Thank You, ${userRecord.username}!</h2>
        <p>We hope you enjoyed your recent appointment with us. Your satisfaction is our top priority, and we are thrilled to have had the opportunity to serve you.</p>
        <p>Should you have any feedback or need further assistance, please do not hesitate to contact us.</p>
        <p>Thank you for choosing Royal Sheers. We look forward to seeing you again!</p>
        <p>Best regards,<br>Royal Sheers Team</p>
      </div>
    `;

    // You can use a similar transporter setup as before to send this thank-you message
    const userMailOptions = {
      from: process.env.SENDER_EMAIL, // Sender address
      to: userRecord.email, // Recipient email
      subject: 'Thank You for Your Appointment', // Subject line
      html: thankYouMessage // HTML body
    };

    transporter.sendMail(userMailOptions, (error, info) => {
      if (error) {
        console.error('Failed to send thank-you email:', error);
      } else {
        console.log('Thank-you email sent: ' + info.response);
      }
    });

    res.status(200).send({
      message: 'Appointment marked as completed. Thank you for your visit!',
      appointment
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).send({ error: 'An error occurred while completing the appointment' });
  }
};


export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).send({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).send({ error: 'Appointment not found' });
    }
    if (appointment.user.toString() !== user.userId) {
      return res.status(403).send({ error: 'Forbidden' });
    }
    await Appointment.deleteOne({ _id: appointment._id });
    res.send({ message: 'Appointment deleted successfully' });
    } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).send({ error: 'An error occurred while deleting the appointment' });
  }
}