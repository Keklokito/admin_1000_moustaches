const Veterinarians = require("../models/veterinarians.model.js");

// Create and Save a new Veterinarians
exports.create = (req, res) => {
  res.status(200).send({});
};

// Retrieve all Veterinarians from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.params.name;

  Veterinarians.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving host veterinarians.",
      });
    else res.send(data);
  });
};

// Find a single Veterinarians with a id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Veterinarians.findById(id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving veterinarian with id ${id}.`,
      });
    else res.send(data);
  });
};

// Update a Veterinarian identified by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  res.status(500).send({});
  return;

  Veterinarians.updateById(id, req.body, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while updating veterinarian with id ${id}.`,
      });
    else res.send(data);
  });
};

// Delete a Veterinarians with the specified id in the request
exports.delete = (req, res) => {
  res.status(200).send({});
};

// Delete all Veterinarians from the database.
exports.deleteAll = (req, res) => {
  res.status(200).send({});
};
