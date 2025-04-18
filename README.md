# DkTube

[![license mit](https://img.shields.io/badge/licence-MIT-6C47FF)](LICENSE)

A project based on Youtube.

## Technologies used

- [Next.Js](https://nextjs.org/)
- [next-safe-action](https://next-safe-action.dev/)
- [Clerk](https://clerk.com/)
- [react-player](https://github.com/CookPete/react-player)

## Install and run the project

### Global Dependencies

You need to have a main dependency installed:

- [Node.js](https://nodejs.dev/) LTS v20 (or any higher version)

Do you use `nvm`? Then you can run `nvm install` in the project folder to install and use the most appropriate version of Node.js.

### Get the repository

```bash
git clone https://github.com/ncontiero/dk-tube.git
```

### Local Dependencies

So after getting the repository, don't forget to install the project's local dependencies:

```bash
pnpm install
```

### Environment variables

Create a `.env` file similar to [`.env.example`](./.env.example).

Change [Clerk](https://dashboard.clerk.com/) and [GCP](https://cloud.google.com/) variables according to your project.

```env
# ...

# Google Cloud
GC_API_KEY="YOUR_GC_API_KEY"

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="YOUR_CLERK_PUBLISHABLE_KEY"
CLERK_SECRET_KEY="YOUR_CLERK_SECRET_KEY"
# Only PROD
CLERK_WEBHOOK_SIGNING_SECRET="YOUR_CLERK_WEBHOOK_SIGNING_SECRET"

# Clerk Routes
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

# ...
```

### Run the project

To run the project locally, just run the command below:

```bash
pnpm dev
```

- go to <http://localhost:3000> to see the application.

## License

This project is licensed under the **MIT** License - see the [LICENSE](./LICENSE) file for details
