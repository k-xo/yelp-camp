const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 20;
        const camp = new Campground({
            //YOUR USER ID
            author: '602aa5663c9b050ae1bbbb61',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [{

                    url: 'https://res.cloudinary.com/duoetdets/image/upload/v1613677639/YelpCamp/bzrhd3dz3uwy3frcchxd.jpg',
                    filename: 'YelpCamp/vwdwarmcgqwxdcq6r70n'
                },
                {
                    url: 'https://res.cloudinary.com/duoetdets/image/upload/v1613626478/YelpCamp/qjp6eufdb5vczgfccikg.jpg',
                    filename: 'YelpCamp/diphp2qrrfk1tiammds8'
                }
            ],

            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Aspernatur possimus itaque deserunt quia, repudiandae nam dolorem totam, aperiam, placeat necessitatibus sed vel tempore libero laborum eaque voluptatum officia odio modi!Voluptatibus ea atque error illo quasi reiciendis doloremque quibusdam blanditiis, cumque consequatur dolorum, quo voluptatum quaerat veritatis quos nisi ratione aut, quis culpa! Quam obcaecati, praesentium aspernatur cum dolorem placeat!',
            price: price
        });
        await camp.save();
    }
};

seedDB()
    .then(() => {
        mongoose.connection.close();
    })
    .catch((e) => {
        console.log('Error closing connection');
        console.log(e);
    });