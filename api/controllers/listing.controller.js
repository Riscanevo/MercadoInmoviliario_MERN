import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json({ success: true, message: 'lista creada correctamente', listing });
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return next(errorHandler(404, '¡Lista no encontrada!'));
    }

    if (req.user.id !== listing.userRef.toString()) {
        return next(errorHandler(401, '¡Solo puedes eliminar tus propios listados!'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('¡Lista eliminada correctamente!');
    } catch (error) {
        next(error);
    }
};

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, '¡Lista no encontrada!'));
    }
    if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, '¡Solo puedes actualizar tus propios listados!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, '¡Lista no encontrada!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
    
    }