# POSTSY App Project Nexus

### Overview
Posty is a cross-platform social media mobile application built using React Native, styled with NativeWind (Tailwind for React Native), and written in TypeScript. The goal of Posty is to provide a clean and interactive platform Wwhere users sign in or register to share posts, view feeds, and interact with other users in a minimal and responsive design.

## Tech Stack
| Technology   | Purpose                          |
|--------------|----------------------------------|
| React Native | Mobile app framework             |
| TypeScript   | Type safety                      |
| NativeWind   | Tailwind-based styling           |
| Figma        | UI/UX design                     |
|              |                                  |

## UI/UX Design
Postsy UI/UX was designed in figma before the actual implemetation.<br/>
Use this link to View the UI design: <a> Link to figma</a>

## Screenshots
<ul>
<li>
<b>Splash</b>
</li>
<li><b>Login</b></li>
<li><b>Register</b></li>
<li><b>Home</b></li>
<li><b>Profle</b></li>

</ul>

## Features
1. <b>User authentication</b> - This includes the sign in and signup forms that ensures that users are registered or login securely to their accounts.
2. <b>Post creation and sharing</b> - This page allows users to create new post that they can publish to the public and they can get feedbacks/comments and likes from their posts.
3. <b>Feed Display</b> - This is the homepage were created feeds are visible and users can scroll through the feeds from other users and even engage.
4. <b>Profile page</b> - this page is designed to display user's account stats such as username, bio, followers and people they follow and their posts.
5. <b>Smooth Navigation transition</b> - The app is designed to ensure that users are able to easily navigate from one page to another smoothly without lagging.

## Project Structure
```
Postsy-Project_nexus/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── Header.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── post/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostCreate.tsx
│   │   │   └── PostList.tsx
│   │   └── profile/
│   │       ├── ProfileHeader.tsx
│   │       ├── ProfileStats.tsx
│   │       └── UserPosts.tsx
│   │
│   ├── screens/
│   │   ├── SplashScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── CreatePostScreen.tsx
│   │   └── UserProfileScreen.tsx
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── TabNavigator.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── storage.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   └── useProfile.ts
│   │
│   ├── types/
│   │   ├── auth.ts
│   │   ├── post.ts
│   │   └── user.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   └── validation.ts
│   │
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── fonts/
│
└── docs/
    └── figma-design.md

```

### Directory Structure Explained
- **`src/components/`** - Reusable UI components organized by feature
- **`src/screens/`** - Main app screens (Splash, Login, Register, Home, Profile)
- **`src/navigation/`** - Navigation setup and routing configuration
- **`src/services/`** - API integration and external services
- **`src/hooks/`** - Custom React hooks for state management
- **`src/types/`** - TypeScript type definitions
- **`src/utils/`** - Helper functions and utilities
- **`src/assets/`** - Static resources (images, icons, fonts)
- **`docs/`** - Project documentation

## Installation and Running the app

### Prerequisities
- Node.js
- Expo CLI or React Native CLI
- Android Studio or Xcode for emulators
- Yarn or npm

### Steps
```
git clone 
cd Postsy
npm install
npx expo start
```

## Future Improvements
- Role-based features (admin, verified users, etc.)
- Direct messaging
- Push notifications
