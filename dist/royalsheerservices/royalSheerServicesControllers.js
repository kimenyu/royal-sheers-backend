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
exports.deleteService = exports.updateService = exports.getService = exports.getServices = exports.createService = void 0;
const serviceModel_1 = __importDefault(require("../models/serviceModel"));
const createService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = new serviceModel_1.default(req.body);
        yield service.save();
        res.status(201).send(service);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.createService = createService;
const getServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield serviceModel_1.default.find({});
        res.send(services);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getServices = getServices;
const getService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield serviceModel_1.default.findById(req.params.id);
        if (!service) {
            return res.status(404).send({ error: 'Service not found' });
        }
        res.send(service);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.getService = getService;
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['type', 'description', 'price', 'duration', 'addOns'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const service = yield serviceModel_1.default.findById(req.params.id);
        if (!service) {
            return res.status(404).send({ error: 'Service not found' });
        }
        updates.forEach(update => (service[update] = req.body[update]));
        yield service.save();
        res.status(200).send({
            message: 'Service updated successfully',
            service
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.updateService = updateService;
const deleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const service = yield serviceModel_1.default.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).send({ error: 'Service not found' });
        }
        res.status(204).send({ message: "service deleted successfully" });
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.deleteService = deleteService;
//# sourceMappingURL=royalSheerServicesControllers.js.map