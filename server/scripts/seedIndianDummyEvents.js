const mongoose = require('mongoose');
const Event = require('../src/models/Event');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: __dirname + '/../.env' });

// Dummy organizers
const organizers = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@web3fest.in',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    password: 'password123',
    role: 'organizer',
    walletAddress: '0x' + Math.random().toString(16).substr(2, 40).padEnd(40, '0'),
  },
  {
    name: 'Amit Verma',
    email: 'amit.verma@blockchainsummit.in',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    password: 'password123',
    role: 'organizer',
    walletAddress: '0x' + Math.random().toString(16).substr(2, 40).padEnd(40, '1'),
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta@daomeetup.in',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    password: 'password123',
    role: 'organizer',
    walletAddress: '0x' + Math.random().toString(16).substr(2, 40).padEnd(40, '2'),
  },
];

const dummyEvents = [
  {
    title: 'Mumbai Web3 Fest',
    description: 'India’s largest Web3 festival for developers, founders, and enthusiasts. Workshops, talks, and hackathons.',
    shortDescription: 'India’s largest Web3 festival.',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '18:00',
    location: {
      address: 'BKC, Mumbai',
      venue: 'Jio World Convention Centre',
      city: 'Mumbai',
      country: 'India',
      coordinates: { lat: 19.0678, lng: 72.8677 }
    },
    maxCapacity: 1000,
    registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    registrationFee: 0.005,
    category: 'conference',
    tags: ['web3', 'mumbai', 'india'],
    credits: 10,
    attendanceRadius: 200,
    isPublic: true,
    requiresApproval: false,
    allowWaitlist: true,
    status: 'published',
    badge: {
      name: 'Mumbai Web3 Attendee',
      description: 'Proof of attendance for Mumbai Web3 Fest.',
      imageUrl: 'https://placehold.co/120x120/4f46e5/fff?text=Mumbai'
    },
    organizerEmail: 'priya.sharma@web3fest.in',
  },
  {
    title: 'Bangalore Blockchain Summit',
    description: 'A summit for blockchain professionals and students in Bangalore. Keynotes, networking, and live demos.',
    shortDescription: 'Bangalore’s top blockchain summit.',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '17:00',
    location: {
      address: 'MG Road, Bangalore',
      venue: 'The Leela Palace',
      city: 'Bangalore',
      country: 'India',
      coordinates: { lat: 12.9716, lng: 77.5946 }
    },
    maxCapacity: 500,
    registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    registrationFee: 0.003,
    category: 'conference', // changed from 'summit'
    tags: ['blockchain', 'bangalore', 'india'],
    credits: 7,
    attendanceRadius: 150,
    isPublic: true,
    requiresApproval: false,
    allowWaitlist: false,
    status: 'published',
    badge: {
      name: 'Bangalore Summit Badge',
      description: 'Attendee badge for Bangalore Blockchain Summit.',
      imageUrl: 'https://placehold.co/120x120/6366f1/fff?text=Bangalore'
    },
    organizerEmail: 'amit.verma@blockchainsummit.in',
  },
  {
    title: 'Delhi DAO Meetup',
    description: 'A private meetup for DAO members in Delhi. Invite-only, with panel discussions and networking.',
    shortDescription: 'DAO members only, Delhi.',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    startTime: '18:00',
    endTime: '22:00',
    location: {
      address: 'Connaught Place, Delhi',
      venue: 'The Imperial',
      city: 'Delhi',
      country: 'India',
      coordinates: { lat: 28.6272, lng: 77.2167 }
    },
    maxCapacity: 80,
    registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    registrationFee: 0,
    category: 'networking', // changed from 'meetup'
    tags: ['dao', 'delhi', 'india'],
    credits: 3,
    attendanceRadius: 60,
    isPublic: false,
    requiresApproval: true,
    allowWaitlist: false,
    status: 'published',
    badge: {
      name: 'Delhi DAO Member',
      description: 'Exclusive badge for Delhi DAO meetup attendees.',
      imageUrl: 'https://placehold.co/120x120/22c55e/fff?text=Delhi'
    },
    organizerEmail: 'neha.gupta@daomeetup.in',
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Upsert organizers
  const organizerMap = {};
  for (const org of organizers) {
    let user = await User.findOne({ email: org.email });
    if (!user) {
      const hashedPassword = await bcrypt.hash(org.password, 10);
      user = await User.create({
        name: org.name,
        email: org.email,
        avatar: org.avatar,
        password: hashedPassword,
        role: org.role,
        walletAddress: org.walletAddress,
      });
    }
    organizerMap[org.email] = user._id;
  }

  // Prepare events with correct organizer ObjectId
  const eventsToInsert = dummyEvents.map(ev => {
    const { organizerEmail, ...rest } = ev;
    return {
      ...rest,
      organizer: organizerMap[ev.organizerEmail],
    };
  });

  await Event.deleteMany({});
  await Event.insertMany(eventsToInsert);
  console.log('Indian dummy events and organizers seeded!');
  await mongoose.disconnect();
}

seed();
