# Food Ordering Application

This is a modern food ordering application built with [Next.js](https://nextjs.org) and [MongoDB](https://www.mongodb.com/). It allows users to browse menu items, place orders, and manage their profiles.

## Features

- **User Authentication**: Secure login and registration using NextAuth.js. Users can create accounts, log in, and manage their profiles securely.
- **Menu Management**: An admin interface allows for the management of menu items and categories. Admins can add, edit, and delete items, ensuring the menu is always up-to-date.
- **Shopping Cart**: Real-time cart management with React Context. Users can add items to their cart, adjust quantities, and proceed to checkout seamlessly.
- **Order Management**: Track orders and payment statuses. Users can view their order history and receive updates on their order status.
- **Payment Integration**: Support for multiple payment gateways (Stripe, Razorpay, Cashfree). Users can choose their preferred payment method for a flexible checkout experience.
- **File Storage**: Upload and manage images using AWS S3. This allows for efficient storage and retrieval of images for menu items and user profiles.
- **Responsive Design**: Built with Tailwind CSS for a seamless user experience. The application is fully responsive, providing an optimal viewing experience across all devices.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd food-ordering-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=<your-mongodb-uri>
   AWS_ACCESS_KEY_ID=<your-aws-access-key>
   AWS_SECRET_ACCESS_KEY=<your-aws-secret-key>
   AWS_BUCKET_NAME=<your-s3-bucket-name>
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** with your browser to see the application.

## Learn More

To learn more about the technologies used in this project, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
