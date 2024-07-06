"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.getAppointments = exports.createAppointmentWithoutStaff = exports.createAppointment = void 0;
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, staff, services, date } = req.body;
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const existingAppointments = yield appointmentModel_1.default.find({
            staff,
            date: { $eq: new Date(date) }
        });
        if (existingAppointments.length) {
            return res.status(400).send({ error: 'Staff is not available at the selected time' });
        }
        const appointment = new appointmentModel_1.default({
            user: req.user._id,
            staff,
            services,
            date,
            status: 'booked',
            totalPrice: yield calculateTotalPrice(services)
        });
        yield appointment.save();
        res.status(201).send(appointment);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.createAppointment = createAppointment;
const createAppointmentWithoutStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user, services, date } = req.body;
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const newAppointment = new appointmentModel_1.default({
            user: req.user._id,
            services,
            date,
            status: status || 'booked',
            totalPrice: yield calculateTotalPrice(services)
        });
        const savedAppointment = yield newAppointment.save();
        res.status(201).json(savedAppointment);
    }
    catch (error) {
        res.status(500).json({ error: 'Could not create appointment', details: error.message });
    }
});
exports.createAppointmentWithoutStaff = createAppointmentWithoutStaff;
const calculateTotalPrice = (services) => __awaiter(void 0, void 0, void 0, function* () {
    let totalPrice = 0;
    for (const serviceId of services) {
        const service = yield serviceModel_1.default.findById(serviceId);
        if (service) {
            totalPrice += service.price;
        }
    }
    return totalPrice;
});
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const appointments = yield appointmentModel_1.default.find({ user: req.user._id }).populate('staff services');
        res.send(appointments);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAppointments = getAppointments;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointment = yield appointmentModel_1.default.findById(req.params.id);
        if (!appointment) {
            return res.status(404).send({ error: 'Appointment not found' });
        }
        if (appointment.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'Forbidden' });
        }
        appointment.status = 'cancelled';
        yield appointment.save();
        res.send(appointment);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.cancelAppointment = cancelAppointment;
//# sourceMappingURL=appointmentController.js.map