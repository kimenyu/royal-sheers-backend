# Royal Sheers – Barber & eCommerce Platform Backend

Royal Sheers is a full-featured backend system built with TypeScript, Express.js, and MongoDB. It powers a modern barbershop and eCommerce platform, offering online appointment booking, staff management, loyalty systems, gifting, product orders, and more.

##  Features

-  JWT-based Authentication for Clients and Staff
-  Online Booking & Appointment Scheduling
- Product Listings and Shopping Cart
-  Staff Management with Availability Control
-  Digital Gift Cards & Loyalty Points System
-  Order Tracking & Notifications
-  Email & Push Notifications
- Scalable REST API structure
-  Admin Dashboard-ready

##  Tech Stack

- **Node.js** + **Express.js**
- **TypeScript**
- **MongoDB** with Mongoose
- **Cloudinary** for media uploads
- **JWT** for authentication
- **ESLint**, **Prettier** for code quality

##  Project Structure

```
royalsheers/
├── accounts/            # Account setup and logic
├── appointments/        # Appointment scheduling
├── carts/               # Shopping cart functionality
├── products/            # Product catalog and details
├── users/               # Client and user handling
├── staff/               # Barber/staff profiles and schedules
├── loyalty/             # Loyalty program system
├── giftcards/           # Gift card logic
├── orders/              # Order processing
├── notifications/       # Notification services
├── config/              # Configuration files
├── models/              # Mongoose models
├── middlewares/         # Custom Express middlewares
├── src/                 # Entry point and routing
```

##  Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/kimenyu/royal-sheers-backend.git
   cd royal-sheers-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add the required environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```

4. Start the server:
   ```bash
   npm run start
   ```

##  Testing

Use tools like **Postman** or **Thunder Client** to test the API endpoints. Authentication is required for most routes.

##  Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your ideas.

##  Contact

**Njoroge Joseph**  
📧 [njorogekimenyu@gmail.com](mailto:njorogekimenyu@gmail.com)  
🔗 [GitHub](https://github.com/kimenyu)
