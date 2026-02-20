# 🗺️ Application Page Architecture

This document outlines the high-level page flow and interaction within the **HandyHouse Services** frontend.

## 🧭 Navigation Flow

The application uses `react-router-dom` for client-side routing. Access to most pages is protected and requires user authentication.

```mermaid
graph TD
    %% Define Styles
    classDef public fill:#e1f5fe,stroke:#01579b,stroke-width:2px;
    classDef protected fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef component fill:#fff3e0,stroke:#ef6c00,stroke-width:2px;

    %% Entry Point
    Start((App Load)) --> AuthCheck{Is User Logged In?}

    %% Public Routes
    subgraph Public_Access [Public Access]
        AuthCheck -- No --> SignIn[Sign In Page]
        SignIn -- Create Account --> SignUp[Sign Up Page]
        SignUp -- Account Created --> SignIn
        SignIn -- Success --> Home
    end

    %% Protected Routes
    subgraph Protected_Area [Protected User Area]
        AuthCheck -- Yes --> Home[Home Page]
        
        %% Navigation Component
        NavBar[Navigation Bar]
        Home -.-> NavBar
        NavBar --> Home
        
        %% Main Feature Pages
        NavBar --> Repair[Repair Services]
        NavBar --> MyBookings[My Bookings]
        NavBar --> Profile[User Profile]
        NavBar --> About[About Us]
        NavBar --> FAQ[FAQ Page]

        %% Interactions
        Home -- "Find Service" --> Repair
        Repair -- "Book Service" --> BookingModal[Booking Modal]
        BookingModal -- "Confirm" --> Payment[Stripe Checkout]
        Payment -- "Success" --> MyBookings
        
        %% Profile Actions
        Profile -- "Edit Details" --> Profile
        Profile -- "Log Out" --> SignOut[Sign Out]
        SignOut --> SignIn
    end

    %% Styling Mapping
    class SignIn,SignUp,FAQ public;
    class Home,Repair,MyBookings,Profile,About protected;
    class NavBar,BookingModal,Payment component;
```

## 📄 Key Page Descriptions

| Page Route | Component | Access | Description |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | 🔒 Protected | The main dashboard displaying recommendations, popular services, and quick access links. |
| `/signin` | `SimpleCard` | 🌍 Public | User login interface with Email/Password and Google OAuth support. |
| `/signup` | `SignupCard` | 🌍 Public | New user registration form. |
| `/RepairServices` | `RepairServices` | 🔒 Protected | Lists available home services, trending options, and allows users to initiate bookings. |
| `/myBookings` | `UserBookings` | 🔒 Protected | Displays current and past service bookings with status updates. |
| `/userProfile` | `UserProfile` | 🔒 Protected | User account details, settings, and address management. |
| `/aboutUs` | `AboutUs` | 🔒 Protected | Information about the HandyHouse Services platform and team. |
| `/Faq` | `Faq` | 🌍 Public* | Frequently asked questions and support information. |

> *Note: While FAQ is generally public information, the current routing configuration may require login depending on specific implementation details.*
