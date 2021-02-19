const Campground = require('../models/campground');
const cloudinary = require('cloudinary').v2;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocoder = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });



module.exports = {

    async index(req, res) {
        const campgrounds = await Campground.find({});
        res.render('campgrounds/index', { campgrounds });
    },

    renderNewForm(req, res) {
        res.render('campgrounds/new');
    },

    async createCampground(req, res, next) {
        const geoData = await geocoder.forwardGeocode({
            query: req.body.campground.location,
            limit: 1
        }).send();
        const campground = new Campground(req.body.campground);
        campground.geometry = geoData.body.features[0].geometry
        campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }))
        campground.author = req.user._id;
        await campground.save();
        console.log(campground)
        req.flash('success', 'Successfully made a new campground');
        res.redirect(`/campgrounds/${campground._id}`);
    },

    async showCampground(req, res) {
        const campground = await Campground.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author'
                }
            })
            .populate('author');

        if (!campground) {
            req.flash('error', `Couldn't find campground`);
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/show', { campground });
    },

    async renderEditForm(req, res) {
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash('error', `Couldn't find campground`);
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', { campground });
    },

    async updateCampground(req, res) {
        const { id } = req.params;
        console.log(req.body);
        const campground = await Campground.findByIdAndUpdate(id, req.body.campground);
        const imgs = req.files.map(file => ({ url: file.path, filename: file.filename }))
        campground.images.push(...imgs);
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        }
        await campground.save();
        console.log(campground)
        req.flash('success', 'Successfully updated campground');
        res.redirect(`/campgrounds/${campground._id}`);
    },

    async deleteCampground(req, res) {
        const campground = await Campground.findByIdAndDelete(req.params.id);
        res.redirect('/campgrounds');
    }

}