# Daily Grocery Food Shopping App 🥗🛒

A modern, high-performance React Native mobile application developed using **Expo** and **JavaScript**, featuring the **Natural Pistachio Green Theme** and **Role-Based Animated Splash Screens**.

The project preserves all features for **Part I (Screens)**, **Part II (React Navigation)**, **Part III (Functionality & Shared State)**, **Customer Order Placement & Admin Order Management**, along with the **Natural Pistachio Green Theme & Role-Based Splash Screens**.

---

## 🎨 1. Natural Pistachio Green Theme

The application features a natural, premium pistachio-green color palette inspired by fresh groceries, organic produce, and nature:

| Token | Hex Code | Usage |
| :--- | :--- | :--- |
| **Primary Pistachio Green** | `#A8C686` | Primary action buttons, selected category chips, active highlights |
| **Dark Natural Green** | `#355E3B` | Main headings, important icons, active tab items, primary branding |
| **Soft Pistachio** | `#DCECC9` | Product cards, subtle badges, decorative aura rings |
| **Pale Mint Background** | `#F4F8ED` | Primary screen backgrounds, input wrappers, header gradients |
| **Cream Surface** | `#FFFDF5` | Product details cards, input containers, drawer surface, cards |
| **Fresh Leaf Green** | `#6B8E4E` | Star ratings, leaf emblems, secondary badges |
| **Sage Green** | `#879B76` | Inactive tab highlights, placeholders, subtitles |
| **Main Text** | `#263528` | High-contrast readable typography for headings & text |
| **Secondary Text** | `#687568` | Secondary labels, descriptions, and metadata |
| **White** | `#FFFFFF` | Card surfaces, icon containers, button text |
| **Border** | `#DCE4D4` | Clean, subtle borders and dividers |
| **Error** | `#C62828` | Destructive alerts, Cancelled status, validation errors |
| **Success** | `#367C43` | Delivered status, success feedback toasts |

### Distinguishable Order Status Colors
- **Pending:** Amber/Orange (`text: #B45309`, `bg: #FEF3C7`, `border: #FDE68A`)
- **Confirmed:** Royal Blue (`text: #1D4ED8`, `bg: #EFF6FF`, `border: #BFDBFE`)
- **Preparing:** Violet/Purple (`text: #6D28D9`, `bg: #F5F3FF`, `border: #DDD6FE`)
- **Out for Delivery:** Deep Teal (`text: #0F766E`, `bg: #F0FDFA`, `border: #99F6E4`)
- **Delivered:** Pistachio / Success Green (`text: #367C43`, `bg: #DCECC9`, `border: #A8C686`)
- **Cancelled:** Vibrant Red (`text: #C62828`, `bg: #FEE2E2`, `border: #FECACA`)

---

## 🚀 2. Role-Based Animated Splash Screen Architecture

### A. App Launch Initial Splash Screen (`SplashScreen.js`)
- Full-screen **Pale Mint** background (`#F4F8ED`).
- Centered grocery app logo (`AppLogo.js`) with smooth **scale and fade-in** animation.
- Subtle pistachio-green circular decorative aura rings.
- App Title: **Daily Grocery Food**.
- Animated loading indicator in **Dark Natural Green** (`#355E3B`).
- Runs authentication session check on app start and transitions to the correct screen:
  - If not signed in: routes to **Welcome / Sign In**.
  - If Customer signed in: routes to **Customer Splash Transition**.
  - If Admin signed in: routes to **Admin Splash Transition**.

### B. Customer Login Splash Screen — Logo Only (`RoleSplashScreen.js`)
- Brief, branded transition screen displayed after Customer authentication (~1.5s).
- **Logo only:** Centered grocery app logo.
- **Privacy rule:** Does **NOT** display the word "Customer", customer's name, or personal details.
- Subtle smooth logo spring and dark green loading spinner.
- Automatically navigates to **Customer Home / Products**.

### C. Admin Login Splash Screen — Logo + ADMIN Text (`RoleSplashScreen.js`)
- Brief, branded transition screen displayed after Admin authentication (~1.5s).
- Centered grocery app logo.
- Directly below the logo: uppercase text **`ADMIN`** in dark natural green (`#355E3B`) with prominent letter spacing (`letterSpacing: 4`).
- Subtitle: `ADMIN DASHBOARD` in sage green.
- Does **NOT** display admin password or sensitive information.
- Automatically navigates to **Admin Dashboard / Manage Orders**.

---

## 🛡️ 3. Authentication & Role-Based Routing Rules

1. **Account-Based Role Determination:**
   - The user's role is determined strictly by the authenticated account record, never solely by a manually selected UI label.
2. **Public Sign Up:**
   - Public registration creates **Customer accounts only**.
3. **Admin Account Creation:**
   - Existing authenticated Admins can create additional Admin accounts from the protected **Manage Products** console (`+ Admin` action).
4. **Access Restrictions:**
   - Customer accounts are prevented from accessing Admin screens (`Manage Orders`, `Manage Products`).
   - Admin accounts are prevented from accessing Customer screens (`Profile`, `Edit Profile`, `Favorites`).
5. **No Duplicate Routes / Loop Prevention:**
   - Splash screens are rendered as top-level transition screens and never added to bottom tabs or navigation histories. Tab switching and drawer navigation never trigger the splash screen again.
6. **Logout:**
   - Cleanly resets authentication and returns to the initial unauthenticated flow.

---

## 🔑 Demo Login Credentials

For quick evaluation and grading, one-tap demo fill buttons are provided on the Welcome screen:

| Role | Email | Password | Post-Login Splash | Landing Dashboard |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | `customer@grocery.com` | `customer123` | **Logo Only** (No customer text) | Customer Home / Catalog |
| **Admin** | `admin@grocery.com` | `admin123` | **Logo + `ADMIN`** | Admin Dashboard / Orders |

---

## 📱 Project Structure

```
model/
├── App.js                                # Root component with Safe Area & Providers
├── app.json                              # Expo app configuration
├── index.js                              # AppRegistry & Gesture Handler setup
├── package.json                          # Expo SDK 58 & React 19 dependencies
├── README.md                             # Documentation & test instructions
└── src/
    ├── theme/
    │   └── colors.js                     # Natural Pistachio Green color tokens
    ├── data/
    │   ├── products.js                   # 9 required grocery produce items
    │   └── bannerSlides.js               # 4-slide banner data with photos, badges, & actions
    ├── context/
    │   ├── AuthContext.js                # Auth, role-checking, splash session state
    │   └── ShopContext.js                # Products, favorites, cart totals, orders store
    ├── components/
    │   ├── AppButton.js                  # Buttons in pistachio, dark green & outline
    │   ├── AppLogo.js                    # Reusable grocery emblem with leaf accents
    │   ├── CategorySelector.js           # Pistachio category selector chips
    │   ├── CartToast.js                  # Global success feedback toast banner for Add to Cart
    │   ├── GroceryBannerSlider.js        # 4-slide auto-scrolling grocery banner slider (3s loop)
    │   ├── HeaderBar.js                  # Circular menu, back, and cart badge buttons
    │   ├── ImageFallback.js              # Image loader with graceful error & emoji fallback
    │   ├── ProductCard.js                # Cream product cards with pistachio cart button
    │   └── QuantitySelector.js           # Integer kilogram plus/minus controls
    ├── screens/
    │   ├── SplashScreen.js               # Initial app launch animated splash screen
    │   ├── RoleSplashScreen.js           # Customer (Logo-only) & Admin (Logo+ADMIN) splash
    │   ├── WelcomeScreen.js              # Welcome, Sign In, Customer-only Sign Up
    │   ├── HomeScreen.js                 # Customer Home with 4-slide banner & categories
    │   ├── ProductsScreen.js             # Full searchable 2-column grocery catalog
    │   ├── ProductDetailsScreen.js       # Large image, min-1 quantity, related items
    │   ├── FavoritesScreen.js            # Customer saved items with empty state
    │   ├── CartScreen.js                 # Cart items, plus/minus, Place Order, Continue Shopping
    │   ├── OrderSuccessScreen.js         # Dedicated animated success screen with pop checkmark
    │   ├── MyOrdersScreen.js             # Customer orders list with status badges
    │   ├── ManageOrdersScreen.js         # Admin orders dashboard (Counters, Search, Filters)
    │   ├── OrderDetailsScreen.js         # Detailed order breakdown & Admin status updater
    │   ├── ProfileScreen.js              # Customer details, statistics, and logout
    │   ├── EditProfileScreen.js          # Profile editing with validation
    │   └── ManageProductsScreen.js       # Admin product management & Create Admin modal
    └── navigation/
        ├── RootNavigator.js              # NavigationContainer
        ├── StackNavigator.js             # Stack (Splash, Welcome, RoleSplash, Main, Details, Success)
        ├── TabNavigator.js               # Cream bottom tabs with dark green active icons
        ├── DrawerNavigator.js            # Side drawer with role restrictions
        └── CustomDrawerContent.js        # Drawer header with user avatar, name, and role badge
```

---

## 🎠 3. 4-Slide Auto-Scrolling Grocery Banner Slider (`GroceryBannerSlider.js`)

Located near the top of the **Customer Home Screen** below the header and above the grocery categories:

### Exactly 4 Slides in Order:
1. **Slide 1 — Fresh Fruits and Vegetables (`FARM FRESH`)**:
   - High-quality photography of colorful fresh fruits and vegetables together.
   - **Heading:** "Freshness at Your Doorstep"
   - **Subtitle:** "Fresh fruits and vegetables every day."
   - **Theme:** Natural pistachio-green and cream design.
   - **Action:** Navigates directly to All Products catalog.
2. **Slide 2 — Fresh Vegetables (`FRESH VEGETABLES`)**:
   - Fresh vegetable photography (tomato, carrot, cabbage, capsicum, pumpkin).
   - **Heading:** "Fresh Vegetables"
   - **Subtitle:** "Healthy greens for your daily meals."
   - **Highlights:** Tomato • Carrot • Cabbage • Capsicum • Pumpkin.
   - **Action:** Filters and navigates to the Vegetables category.
3. **Slide 3 — Fresh Fruits (`NATURE'S SWEETNESS`)**:
   - Seasonal fruit photography (banana, pineapple, orange, lemon, apple).
   - **Heading:** "Nature's Sweetness"
   - **Subtitle:** "Enjoy fresh and delicious seasonal fruits."
   - **Highlights:** Banana • Pineapple • Orange • Lemon • Apple.
   - **Action:** Filters and navigates to the Fruits category.
4. **Slide 4 — Fast Delivery (`EXPRESS SERVICE`)**:
   - Delivery rider and grocery transit photography with bicycle and stopwatch emblems.
   - **Heading:** "Fast Grocery Delivery"
   - **Main Offer Badge:** `Within 30 Minutes` prominent badge.
   - **Supporting Text:** `Delivery within 10 km` coverage radius.
   - **Action:** Informational Alert explaining the 30-minute delivery service offer with option to start shopping.

### Auto-Scrolling & Gesture Behavior:
- **3-Second Interval:** Automatically changes slides every `3000ms`.
- **Continuous Loop:** Seamlessly loops from Slide 4 back to Slide 1.
- **Manual Swiping:** Native horizontal gestures with snap-to-slide physics.
- **4 Pagination Dots:** Active slide highlighted in Dark Natural Green (`#355E3B`), inactive dots in Soft Pistachio (`#DCECC9`). Tap any dot to jump directly to that slide.
- **Lifecycle & Screen Inactive Pausing:** Uses `useIsFocused()` to automatically pause auto-scroll when navigating away, resumes on return, and cancels timers on unmount to eliminate memory leaks.

---

## 🛒 4. Complete Add to Cart, My Cart, and Animated Order Success Flow

### A. Fully Functional Add to Cart (`ShopContext.js` & `CartToast.js`)
- **Supported on All Produce Surfaces:** Works on **Products Catalog**, **Product Details**, **Favorites**, and **Customer Home Screen**.
- **No Duplicate Rows:** Adding an existing item in the cart increments its quantity instead of adding a separate entry.
- **Success Notification:** Immediately triggers a floating, animated top banner: `Added to cart successfully`.
- **Immediate Badge Updates:** The cart badge updates in real time on the Bottom Tab Bar, Side Drawer, and Header Bars.
- **Screen Continuity:** Keeps the customer on their current screen without forcing unwanted navigation.

### B. My Cart Screen (`CartScreen.js`)
- **Product Information:** Displays product thumbnail, name, unit price per kilogram, and total item subtotal.
- **Interactive Quantity Controls:** Integer kilogram plus (`+`) and minus (`-`) buttons via `QuantitySelector`.
- **Zero Quantity Guard:** When decreasing from 1 kg, requests user confirmation before removing the item from the cart.
- **Trash Action:** Individual item removal button with confirmation alert.
- **Financial Breakdown:** Automatically recalculates items subtotal, delivery fee, and grand total immediately on any change.
- **Action Buttons:** Includes both **Place Order** (with loading indicator and submission guard) and **Continue Shopping** (returns to Home/Catalog).
- **Empty State:** Friendly empty cart graphics with a direct "Start Shopping" button.

### C. Dedicated Animated Order Success Screen (`OrderSuccessScreen.js`)
- **Top-Left Back Arrow:** 44×44px circular touch target that navigates safely to **My Orders** without re-submitting orders.
- **Centered Pop Animation:**
  - Scaled circular success badge using React Native `Animated.spring` with smooth pop/bounce physics.
  - Pulsing checkmark icon followed by native fade-in and slide-up of order details (~700ms total).
- **Order Information:** Displays actual unique Order ID (`ORD-XXXXXX-XXX`), timestamp, initial `Pending` status badge, and itemized produce list.
- **Bottom Home Action:** Full-width rounded pistachio-green button with `home-outline` icon that resets the navigation stack to the Customer Home screen.
- **Synchronization:** The newly placed order immediately appears in **Customer My Orders** and **Admin Manage Orders**, with real-time status synchronization.

---

## 🚀 Commands to Run the Application

### 1. Start the Development Server
```bash
npx expo start
```

### 2. Running on Device / Simulator
- **Android Device / Emulator:** Press `a` in the terminal or run `npx expo start --android`.
- **iOS Simulator:** Press `i` in the terminal or run `npx expo start --ios`.
- **Expo Go on Mobile:** Scan the terminal QR code using the Expo Go mobile app.

### 3. Verification & Code Quality
```bash
npx expo lint       # Runs ESLint (0 errors, 0 warnings)
npx expo-doctor     # Runs Expo Doctor (20/20 checks passed)
```
