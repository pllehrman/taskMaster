const notFound = (req,res) => res.status(404).send('Resource does not exist.')

module.exports = notFound