# Angular Task Manager

A comprehensive Angular task management application built with Angular 20, TypeScript, Angular Material, and full test coverage.

## 🚀 Features

- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Task Management**: 
  - Title (required) and description (optional)
  - Status tracking (completed/not completed)
  - Creation timestamps
- **Advanced Filtering**: 
  - Search by title or description
  - Filter by completion status
  - Real-time filtering
- **Modern UI**: 
  - Angular Material design
  - Responsive layout
  - Mobile-friendly interface
- **Routing**: 
  - Task list view (`/tasks`)
  - Task details view (`/tasks/:id`)
  - Create/edit task forms (`/tasks/new`, `/tasks/:id/edit`)
- **Form Validation**: 
  - Reactive forms with validation
  - Real-time error feedback
  - Character limits and requirements
- **Testing**: 
  - ≥90% code coverage
  - Unit tests for all components and services
  - Form validation testing

## 🛠 Tech Stack

- **Angular 20.0.0** - Frontend framework
- **TypeScript** - Programming language
- **Angular Material** - UI component library
- **RxJS** - Reactive programming
- **Jasmine/Karma** - Testing framework
- **SCSS** - Styling

## 📋 Requirements Met

✅ Angular 15+ (using Angular 20.0.0)  
✅ TypeScript implementation  
✅ HTML + CSS/SCSS styling  
✅ Main page `/tasks` with task list  
✅ Add/Delete/Details buttons  
✅ Form validation (title required, description optional)  
✅ Task details page `/tasks/:id` with Back button  
✅ Angular components architecture  
✅ RouterModule routing  
✅ Reactive forms implementation  
✅ @Input/@Output communication  
✅ Task storage service (in-memory)  
✅ Task filtering and search  
✅ Status toggle functionality  
✅ Angular Material styling  
✅ ≥90% test coverage  

## 🏗 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── task-list/          # Main task list view
│   │   ├── task-form/          # Create/edit task form
│   │   └── task-detail/        # Task details view
│   ├── models/
│   │   └── task.model.ts       # Task interface definitions
│   ├── services/
│   │   └── task.service.ts     # Task data management
│   ├── app.config.ts           # App configuration
│   ├── app.routes.ts          # Routing configuration
│   └── app.ts                 # Root component
├── styles.css                 # Global styles
└── index.html                 # App entry point
```

## 🚀 Setup & Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Angular CLI** (v20 or higher)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd test-task-todo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Angular CLI globally** (if not already installed)
   ```bash
   npm install -g @angular/cli
   ```

## 🏃‍♂️ Running the Application

### Development Server

Start the development server:
```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

### Production Build

Build for production:
```bash
npm run build
# or
ng build
```

Built files will be in the `dist/` directory.

## 🧪 Testing

### Run Unit Tests

Execute unit tests with coverage:
```bash
npm test
# or
ng test --code-coverage --watch=false
```

### Run Tests in Watch Mode

For development with auto-rerun:
```bash
ng test
```

### Coverage Report

After running tests with coverage, open `coverage/index.html` in your browser to view the detailed coverage report.

**Current Coverage: ≥90%**
- Statements: ~94%
- Branches: ~90%
- Functions: ~96%
- Lines: ~94%

## 📱 Usage Guide

### Main Features

1. **View Tasks** (`/tasks`)
   - See all tasks in a card layout
   - Filter by status (All, Completed, Not Completed)
   - Search by title or description
   - Quick actions: toggle status, view details, delete

2. **Create Task** (`/tasks/new`)
   - Required title field (1-100 characters)
   - Optional description (up to 500 characters)
   - Form validation with real-time feedback

3. **Task Details** (`/tasks/:id`)
   - View complete task information
   - See creation date and status
   - Quick actions: edit, toggle status, delete

4. **Edit Task** (`/tasks/:id/edit`)
   - Modify existing task details
   - Update status
   - Same validation as create form

### Navigation

- **Header**: Contains app title and add task button
- **Cards**: Click "Details" to view task details
- **Actions**: Use buttons for status toggle, edit, and delete
- **Back Navigation**: Available in forms and detail views

### Responsive Design

- **Desktop**: Multi-column card layout
- **Tablet**: Responsive grid adaptation
- **Mobile**: Single-column stacked layout
- **Touch-friendly**: Large buttons and touch targets

## 🔧 Development

### Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests with coverage
npm run watch      # Build and watch for changes
```

### Key Components

- **TaskService**: Manages task data and operations
- **TaskListComponent**: Main view with filtering
- **TaskFormComponent**: Create/edit functionality
- **TaskDetailComponent**: Detailed task view

### State Management

Uses service-based state management with RxJS:
- BehaviorSubject for task state
- Observable streams for reactive updates
- Automatic UI updates on data changes

## 🎨 Styling

- **Angular Material** theme (Indigo-Pink)
- **Responsive SCSS** styling
- **CSS Grid** and **Flexbox** layouts
- **Custom** hover effects and transitions
- **Accessible** focus indicators

## 🚦 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🐛 Known Issues

- None currently identified

## 📝 License

This project is created as a technical task demonstration.

## 👤 Author

Built with Angular best practices and modern development patterns.

---

**Happy Task Managing! 📋✨**
