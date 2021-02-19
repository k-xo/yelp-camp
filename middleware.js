const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports = {

    isLoggedIn(req, res, next) {
        if (!req.isAuthenticated()) {
            req.session.returnTo = req.originalUrl
            req.flash('error', 'You need to be signed in');
            return res.redirect('/login')
        }
        next()
    },

    validateCampground(req, res, next) {
        const { error } = campgroundSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next()
        }
    },

    async isAuthor(req, res, next) {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!')
            return res.redirect(`/campgrounds/${id}`);
        } else {
            next();
        }

    },

    validateReview(req, res, next) {
        const { error } = reviewSchema.validate(req.body);
        if (error) {
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(msg, 400);
        } else {
            next();
        }
    },

    async isReviewAuthor(req, res, next) {
        const { id, reviewId } = req.params;
        const review = await Review.findById(reviewId);
        if (!review.author.equals(req.user._id)) {
            req.flash('error', 'You do not have permission to do that!')
            return res.redirect(`/campgrounds/${id}`);
        } else {
            next();
        }

    }


}