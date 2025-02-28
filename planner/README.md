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
  - Add subtasks to break down complex tasks
  - Upload and manage task images

- **Progressive Web App**
  - Works offline
  - Can be installed on desktop and mobile devices
  - Responsive design for all screen sizes

- **User-Friendly Interface**
  - Intuitive sidebar for easy navigation
  - Clean, modern UI with smooth animations
  - Dark mode for comfortable viewing

## Installation Options

### 1. Desktop Application (Recommended)

Download and install the TaskPlanner desktop application for your platform:

#### Windows
1. Go to [Releases](https://github.com/robinfrancis186/planner2do/releases)
2. Download `TaskPlanner-Setup.exe`
3. Run the installer
4. Follow the installation wizard
5. Launch TaskPlanner from the Start Menu

#### macOS
1. Go to [Releases](https://github.com/robinfrancis186/planner2do/releases)
2. Download `TaskPlanner.dmg`
3. Open the DMG file
4. Drag TaskPlanner to your Applications folder
5. Launch TaskPlanner from Applications

### 2. Web Application

Access TaskPlanner directly in your browser:
1. Visit [https://robinfrancis186.github.io/planner2do/](https://robinfrancis186.github.io/planner2do/)
2. Click "Install" when prompted to add it to your home screen (optional)

### 3. Development Setup

#### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

#### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/robinfrancis186/planner2do.git
   cd planner2do/planner
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

#### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskplanner
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Platform-Specific Features

### Windows

- Native Windows notifications
- Start with Windows option
- Taskbar integration
- File associations for task attachments
- Windows-style keyboard shortcuts:
  - `Ctrl + N`: New task
  - `Ctrl + S`: Save changes
  - `Ctrl + Del`: Delete task
  - `Alt + Left/Right`: Navigate between columns

### macOS

- Native macOS notifications
- Touch Bar support (on supported devices)
- macOS menu bar integration
- Dark mode synced with system preferences
- macOS keyboard shortcuts:
  - `Cmd + N`: New task
  - `Cmd + S`: Save changes
  - `Cmd + Delete`: Delete task
  - `Cmd + [/]`: Navigate between columns

### Web Browser

- Progressive Web App features
- Push notifications (with permission)
- Offline support
- Add to home screen option
- Keyboard shortcuts:
  - Same as desktop versions
  - Additional browser-specific shortcuts

## Building from Source

### Building the Web App

```bash
cd planner
npm run build
```

### Building Desktop Apps

#### Prerequisites
- Windows build: Windows 10+ or Windows Server 2016+
- macOS build: macOS 10.13+
- Node.js 14+
- Python 2.7 or 3.x (for native modules)
- Visual Studio (Windows) or Xcode (macOS)

#### Build Commands

For all platforms:
```bash
cd planner-desktop
npm run build
```

For specific platforms:
```bash
# Windows only
npm run build:win

# macOS only
npm run build:mac
```

Build outputs will be in the `planner-desktop/dist` directory.

## Troubleshooting

### Windows Issues

1. **Installation Failed**
   - Run installer as administrator
   - Check Windows Defender settings
   - Verify system requirements

2. **App Won't Start**
   - Clear %APPDATA%/TaskPlanner
   - Reinstall the application
   - Check Event Viewer for errors

### macOS Issues

1. **"App is damaged" Message**
   - Right-click the app and select "Open"
   - Allow apps from identified developers in Security & Privacy
   - Use `xattr -cr` command if needed

2. **Permissions Issues**
   - Grant necessary permissions in System Preferences
   - Reset app permissions if needed

### Web App Issues

1. **Offline Mode Not Working**
   - Clear browser cache
   - Reload the page
   - Check browser's PWA support

2. **Performance Issues**
   - Clear browser cache
   - Disable extensions
   - Update your browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

- GitHub Issues: [Report a bug](https://github.com/robinfrancis186/planner2do/issues)
- Email Support: support@taskplanner.com
- Documentation: [Wiki](https://github.com/robinfrancis186/planner2do/wiki)

## Acknowledgments

- Inspired by modern task management applications
- UI design influenced by Material Design principles
- Built with React, Electron, and TypeScript
