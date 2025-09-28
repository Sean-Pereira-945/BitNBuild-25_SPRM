# EventChain 🚀

A modern, blockchain-powered event management platform for organizers and attendees. Mint NFT badges, verify attendance, and automate event logistics—all in one place!

---

## 🌟 Features

- 🏆 **NFT Badge Minting:** Organizers can upload badge images and mint them as NFTs on Polygon.
- 📱 **QR Code Check-ins:** Secure, GPS-aware QR codes for event entry and NFT badge claiming.
- 🏠 **Public Events Home:** Indian-themed public events with organizer details displayed on the home page.
- 🛡️ **Blockchain Verification:** All attendance and badge actions are notarized on-chain.
- 🎨 **Beautiful UI:** Modern, responsive React frontend with a clean dashboard for organizers and attendees.
- 🔒 **Wallet Integration:** Connect your wallet to create, host, or attend events.
- 📊 **Analytics:** Real-time dashboards for attendance, engagement, and badge minting.
- 📨 **Notifications:** Automated reminders and event updates.

---

## 🏗️ Project Structure

```
BitNBuild-25_SPRM/
├── client/         # React frontend (UI, QR, NFT badge, event forms)
├── server/         # Node.js/Express backend (API, DB, blockchain logic)
├── blockchain/     # Smart contracts, Hardhat, Polygon integration
└── README.md       # This file
```

---

## 🚦 Quick Start

1. **Clone the repo:**
   ```sh
   git clone https://github.com/Sean-Pereira-945/BitNBuild-25_SPRM.git
   cd BitNBuild-25_SPRM
   ```
2. **Install dependencies:**
   ```sh
   cd client && npm install
   cd ../server && npm install
   cd ../blockchain && npm install
   ```
3. **Set up environment:**
   - Copy `.env.example` to `.env` in both `client/` and `server/` and fill in required values.
4. **Run the app:**
   - Start backend: `cd server && npm start`
   - Start frontend: `cd client && npm start`
   - (Optional) Start blockchain: `cd blockchain && npx hardhat node`

---

## 🧑‍💼 Organizer Flow

1. Register/login as an organizer.
2. Create an event (with badge image upload).
3. Mint NFT badge for the event.
4. Generate QR code for badge claim at any time.
5. Share QR code with attendees for on-chain badge claiming.

## 👥 Attendee Flow

1. Register/login as an attendee.
2. Browse public events on the home page.
3. Register for events and check in using QR code.
4. Claim NFT badge after check-in.

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, React Query, qrcode.react, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Mongoose, Multer
- **Blockchain:** Hardhat, Solidity, Polygon, Tatum API
- **Other:** Socket.io, JWT Auth, dotenv

---

## 📫 Contact

- Email: EnentChain@EVC.in
- [GitHub Repo](https://github.com/Sean-Pereira-945/BitNBuild-25_SPRM)

---

## 💡 Credits

Made with ❤️ by the EventChain team. Special thanks to all contributors and the open-source community!
