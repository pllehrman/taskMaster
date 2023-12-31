const Organization = require('../models/Organization')
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom_error')

const getAllOrganizations = asyncWrapper( async (req,res) => {
    const organizations = await Organization.find({})
    res.status(200).render('homepage', { organizations })
}) 

const createOrganization = asyncWrapper( async (req,res) =>{
    const organization = await Organization.create(req.body)
    res.status(201).json({organization})
})

const getOrganization = asyncWrapper(async (req,res,next) =>{
    const { id:organizationID } = req.params
    const organization = await organization.findOne({ _id: organizationID});
    if (!organization) {
        return next(createCustomError(`No Organizaiton with id: ${organizationID}`, 404))
    }

    res.status(200).json({ organization })
})

const updateOrganization = asyncWrapper(async (req,res) =>{
    const {id:organizationID} = req.params
    const organization = await Organization.findOneAndUpdate({_id: organizationID}, req.body, {
        new:true,
        runValidators:true
    })
    if(!organization) {
        return next(createCustomError(`No organization with id: ${organizationID}`, 404))
    }

    res.status(200).json({ organization })
})

const deleteOrganization = asyncWrapper(async (req,res) =>{
    const {id:organizationID} = req.params
    const organization = await organization.findOneAndDelete({_id:organizationID})
    
    if(!organization){
        return next(createCustomError(`No organization with id: ${organizationID}`, 404))
    }
    // res.status(200).json({ organization })
    res.status(200).json({ organization: null, status: 'success'})
})

module.exports =  {
    getAllOrganizations
}
