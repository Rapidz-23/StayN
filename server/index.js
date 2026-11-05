import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config({ path: "../.env.local" });

const app = express();
const port = Number(process.env.PORT || 5000);

app.use(cors());
app.use(express.json());

const fallbackProperties = [
  {
    id: "p1",
    title: "Ridge View House",
    type: "Cabin",
    destination: "Tagaytay",
    hostId: "u_maria",
    hostName: "Maria Santos",
    nightlyRate: 3200,
    cleaningFee: 400,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    status: "approved",
    amenities: ["Wi-Fi", "Kitchen", "Parking", "Hot shower"],
    address: "Aguinaldo Highway, Tagaytay",
    lat: 14.1153,
    lng: 120.9621,
    images: ["/T1.jpg", "/T2.jpg", "/T3.jpg", "/T4.jpg", "/T5.jpg"],
    description: "Cool air and Taal views in a cozy home away from home.",
  },
  {
    id: "p3",
    title: "Mactan Shore Beach House",
    type: "Beach house",
    destination: "Cebu",
    hostId: "u_maria",
    hostName: "Maria Santos",
    nightlyRate: 5800,
    cleaningFee: 600,
    maxGuests: 8,
    bedrooms: 4,
    bathrooms: 3,
    status: "approved",
    amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Pool", "Beach access", "TV"],
    address: "Mactan Island, Lapu-Lapu City",
    lat: 10.31,
    lng: 123.98,
    images: ["/C1.jpg", "/C2.jpg", "/C3.jpg", "/C4.jpg", "/C5.jpg"],
    description: "Beachfront living with city access and island-hopping energy.",
  },
];

let db = null;

if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
      }),
    });
  }

  db = admin.firestore();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, message: "StayN backend is running", mode: db ? "firebase" : "mock" });
});

app.get("/api/properties", async (_req, res) => {
  if (db) {
    try {
      const snapshot = await db.collection("properties").get();
      const properties = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json(properties);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.json(fallbackProperties);
});

app.get("/api/bookings", async (_req, res) => {
  if (db) {
    try {
      const snapshot = await db.collection("bookings").get();
      const bookings = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.json(bookings);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.json([]);
});

app.post("/api/properties", async (req, res) => {
  const payload = req.body;

  if (!payload || !payload.title) {
    return res.status(400).json({ error: "Property title is required." });
  }

  if (db) {
    try {
      const docRef = await db.collection("properties").add(payload);
      return res.status(201).json({ id: docRef.id, ...payload });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(201).json({ id: `mock-${Date.now()}`, ...payload });
});

app.listen(port, () => {
  console.log(`StayN backend listening on http://localhost:${port}`);
});
