import { Request, Response } from 'express';
import Service from '../models/serviceModel';
import upload from '../utils/imagesupload/multerConfig';

interface MulterRequest extends Request {
  file: any;
}

export const createService = async (req: MulterRequest, res: Response) => {
  try {
    const { type, description, price, duration, addOns } = req.body;
    const image = req.file ? req.file.path : '';

    const service = new Service({
      type,
      description,
      price,
      duration,
      addOns,
      image,
    });
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
  const allowedUpdates = ['type', 'description', 'price', 'duration', 'addOns', 'image'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send({ error: 'Service not found' });
    }

    updates.forEach(update => {
      (service as any)[update] = req.body[update] || req.file?.path;
    });
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
    res.status(204).send({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};
