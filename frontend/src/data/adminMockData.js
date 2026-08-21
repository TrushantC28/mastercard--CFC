export const mockStats = {
  totalEvents: 35,
  totalVolunteers: 842,
  corporatePartners: 18,
  averageRating: 4.4,
};

export const mockEvents = [
  {
    id: "evt-101",
    name: "Tree Plantation Drive",
    date: "24 Aug 2026",
    time: "9:00 AM - 12:00 PM",
    location: "Pune",
    organizer: "ABC Corporation",
    spocEmail: "rahul@abc.com",
    registeredVolunteers: 42,
    totalSlots: 50,
    status: "Upcoming",
    description: "Community tree planting initiative aiming to plant 500 saplings in urban parks.",
    requiredSkills: "Physical stamina, gardening basic knowledge",
    eventType: "Environment"
  },
  {
    id: "evt-102",
    name: "Youth Career Guidance Workshop",
    date: "28 Aug 2026",
    time: "2:00 PM - 5:00 PM",
    location: "Mumbai",
    organizer: "TechCorp Global",
    spocEmail: "priya@techcorp.com",
    registeredVolunteers: 25,
    totalSlots: 30,
    status: "Upcoming",
    description: "Mentoring high school students on career pathways in technology and business.",
    requiredSkills: "Communication, career counseling",
    eventType: "Education"
  },
  {
    id: "evt-103",
    name: "Blood Donation Camp",
    date: "18 Aug 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Thane",
    organizer: "HealthPlus Foundation",
    spocEmail: "amit@healthplus.org",
    registeredVolunteers: 60,
    totalSlots: 60,
    status: "Completed",
    description: "Annual voluntary blood donation drive organized in partnership with municipal blood bank.",
    requiredSkills: "Event coordination, medical registration assistance",
    eventType: "Healthcare"
  },
  {
    id: "evt-104",
    name: "Beach Clean-up Drive",
    date: "12 Aug 2026",
    time: "7:00 AM - 10:00 AM",
    location: "Girgaon Chowpatty, Mumbai",
    organizer: "EcoPartners India",
    spocEmail: "snea@ecopartners.in",
    registeredVolunteers: 85,
    totalSlots: 100,
    status: "Completed",
    description: "Post-festival beach cleanup to remove plastic waste and debris.",
    requiredSkills: "Waste segregation, teamwork",
    eventType: "Environment"
  },
  {
    id: "evt-105",
    name: "Digital Literacy for Seniors",
    date: "30 Aug 2026",
    time: "11:00 AM - 1:00 PM",
    location: "Pune",
    organizer: "Innovate Ltd",
    spocEmail: "karan@innovate.com",
    registeredVolunteers: 15,
    totalSlots: 20,
    status: "Ongoing",
    description: "Teaching senior citizens smartphone operations, online banking safety, and messaging apps.",
    requiredSkills: "Patience, basic technology skills",
    eventType: "Community Outreach"
  }
];

export const mockVolunteers = [
  {
    id: "vol-201",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    eventsParticipated: 8,
    status: "Active",
    joinedDate: "14 Jan 2025"
  },
  {
    id: "vol-202",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    phone: "+91 9812345678",
    eventsParticipated: 12,
    status: "Active",
    joinedDate: "02 Mar 2024"
  },
  {
    id: "vol-203",
    name: "Vikram Malhotra",
    email: "vikram.m@example.com",
    phone: "+91 9765432109",
    eventsParticipated: 5,
    status: "Active",
    joinedDate: "10 Oct 2025"
  },
  {
    id: "vol-204",
    name: "Ananya Deshmukh",
    email: "ananya.d@example.com",
    phone: "+91 9988776655",
    eventsParticipated: 15,
    status: "Active",
    joinedDate: "18 Nov 2023"
  },
  {
    id: "vol-205",
    name: "Siddharth Rao",
    email: "siddharth.rao@example.com",
    phone: "+91 9123456789",
    eventsParticipated: 2,
    status: "Inactive",
    joinedDate: "05 Jun 2026"
  }
];

export const mockSPOCs = [
  {
    id: "spoc-301",
    company: "ABC Corporation",
    name: "Rahul Verma",
    email: "rahul@abc.com",
    phone: "+91 9822001122",
    eventsOrganized: 5
  },
  {
    id: "spoc-302",
    company: "TechCorp Global",
    name: "Priya Nair",
    email: "priya@techcorp.com",
    phone: "+91 9833112233",
    eventsOrganized: 4
  },
  {
    id: "spoc-303",
    company: "HealthPlus Foundation",
    name: "Amit Joshi",
    email: "amit@healthplus.org",
    phone: "+91 9844223344",
    eventsOrganized: 6
  },
  {
    id: "spoc-304",
    company: "EcoPartners India",
    name: "Sneha Kulkarni",
    email: "sneha@ecopartners.in",
    phone: "+91 9855334455",
    eventsOrganized: 3
  }
];

export const mockFeedback = [
  {
    id: "fb-401",
    eventId: "evt-101",
    eventName: "Tree Plantation Drive",
    volunteerId: "vol-201",
    volunteerName: "Rahul Sharma",
    spocId: "spoc-301",
    rating: 4.6,
    comment: "Well organized and meaningful initiative. Logistics were smooth.",
    date: "24 Aug 2026",
    isUrgent: false
  },
  {
    id: "fb-402",
    eventId: "evt-102",
    eventName: "Youth Career Guidance Workshop",
    volunteerId: "vol-202",
    volunteerName: "Priya Patel",
    spocId: "spoc-302",
    rating: 5.0,
    comment: "Inspiring session! Students were engaged and grateful for guidance.",
    date: "28 Aug 2026",
    isUrgent: false
  },
  {
    id: "fb-403",
    eventId: "evt-103",
    eventName: "Blood Donation Camp",
    volunteerId: "vol-203",
    volunteerName: "Vikram Malhotra",
    spocId: "spoc-303",
    rating: 2.0,
    comment: "Water supply ran out early and starting time was delayed by 45 minutes.",
    date: "18 Aug 2026",
    isUrgent: true
  },
  {
    id: "fb-404",
    eventId: "evt-104",
    eventName: "Beach Clean-up Drive",
    volunteerId: "vol-204",
    volunteerName: "Ananya Deshmukh",
    spocId: "spoc-304",
    rating: 4.8,
    comment: "Great team spirit! Safety gloves and trash bags were adequately provided.",
    date: "12 Aug 2026",
    isUrgent: false
  }
];

export const mockAdminProfile = {
  fullName: "Nilesh Kulkarni",
  email: "admin@sevasahayog.org",
  organization: "SevaSahayog Foundation",
  phone: "+91 9823000000",
  role: "System Administrator / NGO Lead",
  joinedDate: "15 Jan 2022",
  totalEventsManaged: 35,
  totalVolunteers: 842
};
