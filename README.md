# 🏡 Rentora

**Rentora** is a role-based property rental platform designed to connect tenants and landlords with a clean and intuitive user experience. The platform enables secure sign-ups, dynamic dashboard routing, and a modular foundation for property listing and booking functionalities.

---

## 🌟 Key Features (Currently Implemented)

### 🔐 Authentication & Access Control
- Secure sign-up and sign-in system
- Role selection during registration: `tenant` or `landlord`
- Email verification required before access
- Domain restriction applied for tenant role (`@unb.ca`)
- Role-aware redirection to separate landing pages after sign-in

### 🧱 Backend & Database
- API routes to manage user data
- PostgreSQL database managed via Docker and accessible through pgAdmin
- Automatic insertion of verified users into the `users` table with role mapping

### 🖥️ Interface & Routing
- Clean, responsive UI with minimalist design principles
- Role-based navigation: 
  - Tenants redirected to `/tenantlanding`
  - Landlords redirected to `/landlordlanding`
- Built using modern component libraries for consistency and accessibility

### 🧪 Testing & Dev Setup
- Backend tested via Postman
- Manual validation of database entries
- PostgreSQL runs in a local Docker container

---

## 🛠️ Features in Progress

These features are currently being developed to enhance the platform experience:

- 🏠 **Listings View for Tenants**
  - Browse available rental listings in a grid-style layout (image + description)
- ❤️ **Favourite Listings**
  - Tenants can save listings for later viewing
- 📅 **Booking Requests**
  - Tenants can request a viewing appointment with landlords
- 📝 **Landlord Tools**
  - Post listings with images and details
  - Accept or deny viewing requests

