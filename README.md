# Visual Product Matcher

## Overview
Visual Product Matcher is a web application that enables users to find visually similar products by uploading images or providing image URLs. It supports advanced image processing, similarity checking, and provides a user-friendly interface for searching, filtering, and storing images for future reference.

## Features
- **User Authentication**: Login and register functionality.
- **Image Upload**: Support for file uploads, image URL and can take drop box input.
- **Image Processing**: Utilizes Sharp for image transformations and cosine similarity for vector computations.
- **Similarity Checking**: Dataset of random images from Kaggle used for vector generation and similarity comparisons.
- **Search & Store**: Users can search for similar images and store them for future reference.
- **Filtering**: Filters based on similarity scores to refine search results.
- **Responsive Design**: Web application is mobile-friendly and responsive.
- **User-Friendly Interface**: Easy navigation and intuitive user experience.

## Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: Vite + React
- **Database**: MongoDB
- **Styling**: Bootstrap

## Installation
Follow these steps to clone and install the project on your local system:

### Prerequisites
- Node.js and npm installed
- MongoDB installed and running locally or on a cloud service

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/visual-product-matcher.git
   cd visual-product-matcher
   ```

2. **Set Up Backend**:
   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file and add the following environment variables:
     ```env
     PORT=5000
     MONGO_URI=<your_mongo_db_connection_string>
     JWT_SECRET=<your_jwt_secret>
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Set Up Frontend**:
   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the frontend server:
     ```bash
     npm run dev
     ```

4. **Access the Application**:
   - Open your browser and visit `http://localhost:5173` to access the application.

## Approach
The application leverages Sharp for image processing and cosine similarity for calculating visual similarities. A dataset of random images from Kaggle serves as the basis for vector generation and similarity comparisons. The application’s modular design ensures scalability and maintainability while Bootstrap ensures a responsive and user-friendly interface.

## Deployment
The application can be deployed on any free hosting service like Vercel (frontend) and Render (backend). Ensure the environment variables are properly configured during deployment.

## Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.


