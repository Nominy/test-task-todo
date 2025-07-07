# Angular Task Manager

## Tech Stack

- Angular 20.0.0
- TypeScript
- Angular Material
- RxJS
- Jasmine/Karma (testing)
- SCSS

## Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+) 
- Angular CLI (v20+)

### Installation
```bash
git clone <repository-url>
cd test-task-todo
npm install
npm start
```

Application runs at `http://localhost:4200`

## Available Scripts

```bash
npm start          # Development server
npm run build      # Production build
npm test           # Run tests with coverage
```

## Testing

Run tests with coverage:
```bash
ng test --code-coverage --watch=false
```

Coverage report available at `coverage/index.html`

## Project Structure

```
src/app/
├── components/
│   ├── task-list/      # Main task listing
│   ├── task-form/      # Create/edit forms
│   └── task-detail/    # Task details view
├── models/
│   └── task.model.ts   # Task interface
├── services/
│   └── task.service.ts # Data management
└── app.routes.ts       # Routing config
```

## Routes

- `/tasks` - Task list with filtering
- `/tasks/new` - Create new task
- `/tasks/:id` - Task details
- `/tasks/:id/edit` - Edit task

## License

Technical demonstration project.
