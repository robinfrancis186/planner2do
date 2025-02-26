# TaskPlanner - Progressive Web App for Task Management

TaskPlanner is a modern, responsive Progressive Web App (PWA) designed to help users manage their workload and boost productivity. It allows users to organize tasks into pages and track their completion status with an intuitive drag-and-drop interface.

![TaskPlanner Screenshot](screenshot.png)

## Features

- **Page Management**
  - Create, edit, and delete pages with customizable colors
  - Organize tasks by project or category

- **Task Management**
  - Add, edit, and delete tasks within each page
  - Track task completion status (Not Started, Pending, In Progress, Completed)
  - Set task priorities (Low, Medium, High)
  - Add due dates to tasks
  - Drag and drop tasks between different status columns

- **Progressive Web App**
  - Works offline
  - Can be installed on desktop and mobile devices
  - Responsive design for all screen sizes

- **User-Friendly Interface**
  - Intuitive sidebar for easy navigation
  - Clean, modern UI with smooth animations
  - Dark mode for comfortable viewing

## Technologies Used

- React.js
- CSS3 with custom variables
- HTML5 Drag and Drop API
- date-fns for date formatting
- React Router for navigation
- LocalStorage for data persistence
- Service Workers for offline functionality

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/taskplanner.git
   cd taskplanner
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

To build the app for production, run:

```
npm run build
```

The build files will be located in the `dist` directory.

## Usage

1. **Creating a Page**
   - Click on "Add Page" in the sidebar
   - Enter a name for your page
   - Click "Add"

2. **Adding a Task**
   - Select a page from the sidebar
   - Click "Add Task" button
   - Fill in the task details (title, description, status, priority, due date)
   - Click "Add Task"

3. **Managing Tasks**
   - Drag and drop tasks between status columns
   - Click on a task to view details, edit, or delete
   - Change task status, priority, and due date in the task detail view

4. **Editing/Deleting Pages**
   - Hover over a page name to reveal edit and delete buttons
   - Click "Edit" to rename the page
   - Click "Delete" to remove the page and all its tasks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by modern task management applications
- UI design influenced by Material Design principles
