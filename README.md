### Ruchicart Food Delivery Platform

A comprehensive, modern food delivery platform frontend built with Next.js, offering a seamless experience for customers to browse restaurants, order food, and track deliveries.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Component Documentation](#component-documentation)
- [Contributing](#contributing)
- [License](#license)

## Overview

This food delivery platform provides a complete solution for online food ordering. It features a responsive design, intuitive user interface, and seamless checkout process. The application is built with scalability and performance in mind, utilizing modern web technologies and best practices.

## Features

### For Customers

- **Restaurant & Menu Browsing**: Browse restaurants and view detailed menus with categories
- **Browse Branch by Location**: Browse restaurants and view by location and nearby branch and Choose from multiple restaurant branches based on location
- **Product Details**: Comprehensive product information with images, descriptions, and customization options
- **Search & Filtering**: Advanced search functionality with multiple filtering options
- **Cart Management**: Add, remove, and modify items in cart with real-time updates
- **Variant Selection**: Choose from multiple product variants (size, flavor, etc.)
- **Add-ons & Customization**: Customize orders with additional toppings or special requests
- **Checkout Process**: Streamlined, multi-step checkout with address and payment selection
- **Checkout for login users**: User can go Checkout if the user is already login
- **Guest Checkout for unauthenticated user**: unauthenticated User redirect to guest Checkout if the user is not login
- **Responsive Design**: Optimized for all devices (mobile, tablet, desktop)
- **Offline Support**: Basic functionality available even without internet connection
- **Order Tracking**: Real-time order status updates
- **User Profiles**: Save delivery addresses, payment methods, order history, and wallet features

## Demo

### Project Presentation Video

[Watch the Project Presentation](https://www.youtube.com/watch?v=9_NgWf7Bivk)

### Live Demo

[Visit the Live Demo](https://ruchicart.com)

## Technologies Used

### Frontend

- **Next.js 15**: React framework with App Router for partial pre rendering and server-side rendering and routing
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For responsive and customizable styling
- **Shadcn UI**: Component library for consistent UI elements
- **React Hook Form**: For form validation and handling
- **Zustand**: State management for cart and user preferences
- **Framer Motion**: For smooth animations and transitions
- **Lucide React**: For icons and visual elements

### Backend Integration

- **RESTful API**: Integration with backend services
- **Google Maps API**: For location services and branch selection
- **Payment Gateway Integration**: Secure payment processing

## Project Structure

[Project Documentation Link](https://ibrahimsifat.notion.site/RuchiCart-Frontend-1835ac2bfa4980d0a4cae9d86add0d3b?pvs=4)

### Components tree

![Component tree image](/public/images/ruchicart-Front-end%20component%20tree.drawio.png)

[Component tree Link](https://drive.google.com/file/d/1DFGjv9wP8WgIM80mS3G9G0t6Pa86OmFG/view)

## Installation

```shellscript
# Clone the repository
git clone https://github.com/ibrahimsifat/ruchicart-web-front-end.git

# Navigate to the project directory
cd ruchicart-web-front-end

# Install dependencies
pnpm install

# Run the development server
pnpm run dev
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_IMAGE_URL=https://your-image-server.com
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
API_URL=https://your-api-server.com
API_BASE_URL=https://your-api-server.com/api
NEXT_PUBLIC_API_URL=https://your-api-server.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=asdfasdf
```

## Contributing

We welcome contributions to improve the Food Delivery Platform!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate and adhere to the existing coding style.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

© 2025 Ibrahim Sifat. All rights reserved.
