# Airbnb-Inspired-Travel-Rental-Platform
A full-stack Airbnb-inspired travel and rental platform built using Node.js, Express.js, MongoDB, EJS, and Bootstrap. Features include property listings, user authentication and authorization, CRUD operations, reviews and ratings, image uploads, search functionality, and interactive maps using Leaflet.js.

# Airbnb-Inspired — Full-Stack Travel & Rental Platform

A full-stack travel and rental platform inspired by Airbnb, built using Node.js, Express.js, MongoDB, EJS, and Bootstrap. The application allows users to explore property listings, view property details, add reviews, and manage listings through a responsive web interface.

##  About the Project

This project is inspired by Airbnb and was developed to understand and implement full-stack web development concepts. It provides a platform for users to discover rental properties, view property information, share reviews, and manage listings.

The application follows the **MVC (Model-View-Controller)** architecture and includes authentication, authorization, server-side validation, database relationships, and error handling.

##  Features

* **User Authentication:** Secure user registration and login using Passport.js.
* **Authorization:** Restricts protected actions to authorized users.
* **Property Listings:** Create, view, update, and delete property listings.
* **Reviews & Ratings:** Users can add reviews and ratings to properties.
* **Image Uploads:** Upload and display property images.
* **Search Functionality:** Search and explore available property listings.
* **Interactive Maps:** Display property locations using Leaflet.js.
* **Form Validation:** Validate user input using Joi and server-side validation.
* **Session Management:** Maintain user sessions and display flash messages.
* **Responsive Design:** Build user-friendly interfaces using Bootstrap.
* **Error Handling:** Manage application errors through custom middleware.
* **MVC Architecture:** Organize application code into models, views, and controllers.

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Bootstrap
* EJS (Embedded JavaScript Templates)

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MongoDB
* Mongoose

### Authentication & Validation

* Passport.js
* Joi
* Express Session

### Tools & Libraries

* Leaflet.js
* EJS-Mate
* Method-Override
* Connect-Flash
* Git
* GitHub
* VS Code

##  Project Architecture

The application follows the **MVC architecture**:

* **Models:** Define database schemas and manage data using Mongoose.
* **Views:** Render dynamic web pages using EJS templates.
* **Controllers:** Handle application logic and process user requests.
* **Routes:** Define endpoints for listings, reviews, authentication, and other operations.
* **Middleware:** Handle authentication, authorization, validation, and error management.

##  Project Structure

```text
Airbnb-Inspired-Travel-Rental-Platform/
│
├── controllers/
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
│
├── models/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── routes/
│   ├── listing.js
│   ├── review.js
│   └── user.js
│
├── views/
│   ├── layouts/
│   ├── includes/
│   ├── listings/
│   └── users/
│
├── public/
│   ├── css/
│   └── js/
│
├── utils/
│
├── middleware.js
├── app.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

*Note: The folder structure above is illustrative. Update it according to your actual project files.*

## ⚙️ Installation and Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Ilma-gulzar21/Airbnb_Clone.git
```

### 2. Navigate to the Project Directory

```bash
cd Airbnb_Clone
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory and add the environment variables required by your application.

Example:

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

Replace these example values with your actual configuration. Use only the variables required by your project.

**Important:** Never upload your `.env` file, database credentials, API keys, or other secrets to GitHub.

### 5. Start the Application

```bash
node app.js
```

If your project uses Nodemon, you can start it with:

```bash
nodemon app.js
```

### 6. Open in Browser

Once the server starts, open:

```text
http://localhost:8080
```

Make sure the port matches the configuration in your application.

##  Environment Configuration

The application may require the following services and configuration:

* **MongoDB:** Stores users, property listings, and reviews.
* **Cloudinary:** Stores uploaded property images, if configured.
* **Session Secret:** Protects session data.
* **Express Server:** Runs the application locally.

Configure these services before running the application.

##  Application Workflow

1. Users open the application and explore available property listings.
2. Users can register or log in to access protected features.
3. Authorized users can create and manage property listings.
4. Users can view property details and images.
5. Users can explore property locations on an interactive map.
6. Authenticated users can submit reviews and ratings.
7. The application validates requests and manages errors using middleware.

##  Key Concepts Implemented

This project helped implement and practice the following concepts:

* Full-stack web development
* RESTful routing and CRUD operations
* MVC architecture
* MongoDB schema design and relationships
* Authentication and authorization
* Session management
* Server-side validation
* Middleware implementation
* Image upload integration
* Dynamic rendering with EJS
* Error handling
* Interactive maps integration

##  Future Improvements

* Add advanced search and filtering options.
* Integrate a secure payment gateway.
* Add a wishlist or favorites feature.
* Improve property recommendations.
* Add booking and availability management.
* Enhance the user interface and accessibility.

##  Developer

**Ilma Gulzar**

* GitHub: [Ilma-gulzar21](https://github.com/Ilma-gulzar21)

##  License

This project was developed for learning and educational purposes.

---

**Disclaimer:** This is an independently developed, Airbnb-inspired project created for educational purposes. It is not affiliated with, endorsed by, or associated with Airbnb, Inc.
