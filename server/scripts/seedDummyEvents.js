const mongoose = require('mongoose');
const Event = require('../src/models/Event');
require('dotenv').config({ path: __dirname + '/../.env' });

const dummyEvents = [
  {
    title: 'Web3 Hackathon 2025',
    description: 'A 48-hour hackathon for blockchain developers and enthusiasts.',
    shortDescription: '48-hour blockchain hackathon.',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '18:00',
    location: {
      address: '123 Crypto Ave',
      venue: 'Decentral Hall',
      city: 'Lisbon',
      country: 'Portugal',
      coordinates: { lat: 38.7223, lng: -9.1393 }
    },
    maxCapacity: 200,
    registrationDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    registrationFee: 0.01,
    category: 'hackathon',
    tags: ['web3', 'hackathon', 'blockchain'],
    credits: 5,
    attendanceRadius: 100,
    isPublic: true,
    requiresApproval: false,
    allowWaitlist: true,
    status: 'published',
    badge: {
      name: 'Hackathon Winner',
      description: 'Awarded to all participants.',
      imageUrl: 'https://placehold.co/120x120/4f46e5/fff?text=NFT'
    }
  },
  {
    title: 'Polygon Dev Summit',
    description: 'A summit for Polygon developers to network and learn.',
    shortDescription: 'Polygon developer summit.',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '17:00',
    location: {
      address: '456 Layer2 Blvd',
      venue: 'Polygon Center',
      city: 'Berlin',
      country: 'Germany',
      coordinates: { lat: 52.52, lng: 13.405 }
    },
    maxCapacity: 300,
    registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    registrationFee: 0.02,
    category: 'summit',
    tags: ['polygon', 'summit', 'dev'],
    credits: 3,
    attendanceRadius: 150,
    isPublic: true,
    requiresApproval: false,
    allowWaitlist: false,
    status: 'published',
    badge: {
      name: 'Polygon Attendee',
      description: 'Proof of attendance for Polygon Dev Summit.',
      imageUrl: 'https://placehold.co/120x120/6366f1/fff?text=Polygon'
    }
  },
  {
    title: 'Private DAO Meetup',
    description: 'Exclusive meetup for DAO members only.',
    shortDescription: 'DAO members only.',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    startTime: '18:00',
    endTime: '22:00',
    location: {
      address: '789 Governance Rd',
      venue: 'DAO Lounge',
      city: 'London',
      country: 'UK',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    maxCapacity: 50,
    registrationDeadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    category: 'meetup',
    tags: ['dao', 'private', 'meetup'],
    credits: 2,
    attendanceRadius: 50,
    isPublic: false,
    requiresApproval: true,
    allowWaitlist: false,
    status: 'published',
    badge: {
      name: 'DAO Member',
      description: 'Exclusive badge for DAO meetup attendees.',
      imageUrl: 'https://placehold.co/120x120/22c55e/fff?text=DAO'
    }
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Event.deleteMany({});
  await Event.insertMany(dummyEvents);
  console.log('Dummy events seeded!');
  await mongoose.disconnect();
}

seed();
