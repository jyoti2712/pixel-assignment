Pixel Code Test: Next.js Work Orders App
This is a solution for the Pixel Code Test, a small full-stack application for managing work orders. It's built with Next.js (App Router), TypeScript, Prisma, and NextAuth.js.

Time Spent: 2 hours

Features Implemented
Authentication: Secure sign-in for "user" and "manager" roles using NextAuth.js with credentials. Middleware protects all order-related pages.

Role-Based Access Control:

Users can create new work orders, view a list of their own orders, and edit the title, description, and priority of their orders.

Managers have full access. They can view all work orders in the system, create new orders, and edit any order, including assigning a user and changing its status.

Dynamic Orders List (/orders):

Server-Side Pagination: The list is paginated with 10 orders per page to handle large datasets efficiently.

Search & Filtering: Users can perform a text search across order titles and descriptions, and filter the list by status and priority. All filtering and searching is handled on the server.

Scoped Results: The list automatically shows only the user's own orders if they have the "USER" role, and all orders for managers.

Create & Edit Orders:

Create Order Page (/orders/new): A dedicated form for creating new work orders.

Detail Page with Inline Editing (/orders/[id]): View order details and click "Edit" to modify fields directly on the page without a full reload.

Server-Side Validation: All form submissions for creating and updating orders are validated on the server using Zod to ensure data integrity.

UI States: The application includes basic loading states using React Suspense, as well as clear empty and error states to provide a better user experience.

Tech Stack
Framework: Next.js (App Router)

Language: TypeScript

Authentication: NextAuth.js

Database ORM: Prisma

Database: SQLite

Styling: Tailwind CSS

Validation: Zod

Getting Started
Follow these instructions to get the project running on your local machine.

Prerequisites
Node.js (v20 or newer)

npm (or your preferred package manager)

Installation & Setup
Clone the repository:

git clone <https://github.com/jyoti2712/pixel-assignment.git>
cd <pixel-assignment>
Install dependencies:

npm install
Create your environment file: Copy the example file.


cp .env.example .env
Open the new .env file and set the NEXTAUTH_SECRET. You can generate a secret with the following command:

openssl rand -base64 32
Set up the database: These commands will generate the Prisma client, create the database file, and run the initial migration to create the necessary tables.

npx prisma generate
npx prisma migrate dev --name init
Seed the database: This will populate the database with two test accounts (a manager and a user) and some sample work orders.

npm run seed
Run the development server:

npm run dev
The application will be available at http://localhost:3000.

Test Accounts
You can use the following accounts to test the application:

Manager Account:

Email: manager@example.com

Password: Password123!

User Account:

Email: user@example.com

Password: Password123!

Project Structure
Here is an overview of the key files and directories in the project:

/
├── app/                  # Main application code (App Router)
│   ├── orders/           # Pages and components for work orders
│   │   ├── [id]/         # Dynamic route for order details
│   │   │   ├── actions.ts  # Server actions for updating orders
│   │   │   └── page.tsx    # Order detail page component
│   │   ├── new/          # Page for creating a new order
│   │   ├── actions.ts    # Server actions for creating/fetching orders
│   │   └── page.tsx      # Main orders list page
│   ├── api/              # API routes (e.g., for NextAuth)
│   ├── layout.tsx        # Root layout for the application
│   └── page.tsx          # Home page (redirects to /orders)
├── components/           # Reusable React components
│   ├── order-details.tsx # Component for viewing and editing an order
│   ├── orders-list.tsx   # Component for displaying the list of orders
│   └── session-provider.tsx # Client-side provider for NextAuth session
├── lib/                  # Core utility files
│   ├── auth.ts           # NextAuth.js configuration
│   └── prisma.ts         # Prisma client initialization
├── prisma/               # Database configuration
│   ├── migrations/       # Database migration files
│   ├── schema.prisma     # Prisma schema defining the database models
│   └── seed.ts           # Script for seeding the database
└── ...
Trade-offs and Future Improvements
UI/UX: The UI is intentionally minimal to meet the test requirements. A real-world application would benefit from a more polished design, including better feedback on form submissions (e.g., toast notifications), more advanced filtering controls, and a more robust layout.

Error Handling: The current error handling is basic. I would improve this by implementing more specific error messages and potentially a global error handling strategy (e.g., using a library like react-error-boundary).

Optimistic UI: The prompt mentioned optimistic UI as an option for edits. I chose to use server actions with revalidatePath for simplicity and to ensure data consistency. For an application with higher latency or a need for a snappier feel, implementing optimistic updates would be a great next step.

State Management: For this simple app, React's built-in state management (useState, useActionState) is sufficient. For a more complex application, I would consider a dedicated state management library like Zustand or Jotai to manage global state more effectively.

Testing: No tests were written for this project. The "Stretch Goals" mention Playwright tests, which would be an excellent addition to ensure the application remains stable and bug-free as it evolves. Unit tests for the server actions would also be valuable.