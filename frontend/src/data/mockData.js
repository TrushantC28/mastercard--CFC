// Mock Data for Volunteer Portal UI

export const volunteerStats = {
  activitiesJoined: 12,
  feedbackSubmitted: 8,
  volunteerHours: 36,
  impactPoints: 240,
};

export const upcomingActivities = [
  {
    id: 1,
    title: "Tree Plantation Drive",
    date: "12 Aug 2026",
    time: "09:00 AM - 01:00 PM",
    location: "Sanjay Gandhi National Park, Mumbai",
    ngo: "Green Earth Foundation",
    status: "Completed",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&q=80",
    description: "Join us in our mission to plant 1000 saplings in a single day.",
    requirements: "Comfortable clothes, water bottle.",
    slots: 0,
    registeredVolunteers: 150,
  },
  {
    id: 2,
    title: "Coastal Cleanup",
    date: "24 Aug 2026",
    time: "07:00 AM - 10:00 AM",
    location: "Juhu Beach, Mumbai",
    ngo: "Ocean Saviors",
    status: "Registered",
    image: "https://images.unsplash.com/photo-1618477461853-cf6ed80fbea5?w=500&q=80",
    description: "Help us clean up the beach after the festival weekend.",
    requirements: "Gloves (will be provided), cap, sunscreen.",
    slots: 20,
    registeredVolunteers: 80,
  },
  {
    id: 3,
    title: "Education for All - Teaching Drive",
    date: "05 Sep 2026",
    time: "10:00 AM - 12:00 PM",
    location: "Dharavi Community Center",
    ngo: "Teach for India",
    status: "Open",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=500&q=80",
    description: "Spend a weekend morning teaching basic math and English to underprivileged children.",
    requirements: "Basic knowledge of 5th-grade math and English.",
    slots: 15,
    registeredVolunteers: 5,
  }
];

export const recentFeedback = [
  {
    id: 1,
    eventName: "Tree Plantation Drive",
    date: "12 Aug 2026",
    rating: 5,
    shortFeedback: "Very well organized and meaningful experience. Looking forward to more such events.",
    theme: "Organization",
    sentiment: "Positive",
    status: "Submitted",
  },
  {
    id: 2,
    eventName: "Old Age Home Visit",
    date: "01 Aug 2026",
    rating: 4,
    shortFeedback: "Heartwarming interactions, but the schedule was a bit rushed.",
    theme: "Event Experience",
    sentiment: "Neutral",
    status: "Submitted",
  }
];

export const volunteerProfile = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+91 9876543210",
  location: "Mumbai, Maharashtra",
  organization: "KJ Somaiya College of Engineering",
  role: "volunteer",
  avatar: "JD"
};
