# Contributing to Security Tools MCP Server

Thank you for considering contributing to the Security Tools MCP Server! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone. Please be considerate of differing viewpoints and experiences, and show empathy towards other community members.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:

1. A clear, descriptive title
2. A detailed description of the issue
3. Steps to reproduce the bug
4. Expected behavior
5. Actual behavior
6. Screenshots (if applicable)
7. Environment information (OS, Node.js version, etc.)

### Suggesting Enhancements

For feature requests or enhancements:

1. Create an issue with a clear title and detailed description
2. Explain why this enhancement would be useful
3. Suggest an implementation approach if possible

### Pull Requests

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests and ensure code quality
5. Commit your changes with clear, descriptive commit messages
6. Push to your branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## Development Guidelines

### Code Style

- Follow the existing code style in the project
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single task

### TypeScript Guidelines

- Use proper TypeScript types
- Avoid using `any` type when possible
- Document public interfaces with JSDoc comments

### Testing

- Add tests for new features
- Ensure all tests pass before submitting a pull request
- Update existing tests if necessary

### Security Considerations

Since this project deals with security tools:

- Be extra cautious with input validation
- Avoid introducing command injection vulnerabilities
- Consider the security implications of any changes

## Git Workflow

1. Create a branch from `main` for your work
2. Make regular, small commits with clear messages
3. Keep your branch updated with the latest changes from `main`
4. Squash commits if necessary before submitting a pull request

## License

By contributing to this project, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

## Questions?

If you have any questions about contributing, please open an issue for discussion.

Thank you for your contributions!
