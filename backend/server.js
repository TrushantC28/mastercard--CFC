import "dotenv/config";
import connectDB from "./src/db/index.js";

import "./src/models/User.js";
import "./src/models/RefreshToken.js";
import "./src/models/DonorProfile.js";
import "./src/models/Scheme.js";
import "./src/models/Donation.js";
import "./src/models/Match.js";
import "./src/models/ImpactUpdate.js";
import "./src/models/Notification.js";

console.log("All models loaded successfully");

export { connectDB };
