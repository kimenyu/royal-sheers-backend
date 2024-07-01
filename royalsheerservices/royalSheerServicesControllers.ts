import { Request, Response } from 'express';
import Service from '../models/serviceModel';

export const createService = async (req: Request, res: Response) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).send(service);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find({});
    res.send(services);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }
    res.send(service);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const updateService = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['type', 'description', 'price', 'duration', 'addOns'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }

    updates.forEach(update => (service[update] = req.body[update]));
    await service.save();
    res.status(200).send({
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }
    res.status(204).send({message: "service deleted successfully"});
  } catch (error) {
    res.status(500).send(error);
  }
};
