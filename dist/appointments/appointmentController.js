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
exports.cancelAppointment = exports.getAppointmentById = exports.getAppointments = exports.createAppointmentWithoutStaff = exports.createAppointment = void 0;
const appointmentModel_1 = __importDefault(require("../models/appointmentModel"));
const staffModel_1 = __importDefault(require("../models/staffModel"));
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
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
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
        const staffMember = yield staffModel_1.default.findById(staff);
        if (!staffMember) {
            return res.status(400).json({ error: 'Invalid staff ID' });
        }
        // Validate services existence
        const serviceIds = yield serviceModel_1.default.find({ '_id': { $in: services } });
        if (serviceIds.length !== services.length) {
            return res.status(400).json({ error: 'One or more services are invalid' });
        }
        // Calculate total price
        const totalPrice = yield calculateTotalPrice(services);
        // Create appointment
        const appointment = new appointmentModel_1.default({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            staff,
            services,
            date,
            totalPrice,
            status: 'booked'
        });
        const result = yield appointment.save();
        return res.status(201).json({
            message: 'Appointment created successfully',
            appointment: result
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
});
exports.createAppointment = createAppointment;
const createAppointmentWithoutStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const { services, date } = req.body;
        if (!user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const newAppointment = new appointmentModel_1.default({
            user: user.userId, // Ensure this is the correct field
            services,
            date,
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
const getAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const appointments = yield appointmentModel_1.default.find({ user: user.userId }).populate('services').populate('staff');
        res.send(appointments);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAppointments = getAppointments;
const getAppointmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        if (!req.user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const appointment = yield appointmentModel_1.default.findById(req.params.id).populate('services').populate('staff');
        if (!appointment) {
            return res.status(404).send({ error: 'Appointment not found' });
        }
        res.send(appointment);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getAppointmentById = getAppointmentById;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const appointment = yield appointmentModel_1.default.findById(req.params.id);
        if (!appointment) {
            return res.status(404).send({ error: 'Appointment not found' });
        }
        if (appointment.user.toString() !== user.userId.toString()) {
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