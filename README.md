# URL Shortener

A modern URL shortening service built with Next.js.

Visit [https://url.insufficient.ca](http://url.insufficient.ca) to see the demo application.

## Features

- Create shortened URLs
- Track click statistics
- Custom URL aliases (optional)
- Fast redirect performance
- Modern, responsive UI
- QR code generation for shortened URLs

## Tech Stack

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma 5.17.0
- PostgreSQL

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/mooyeon-seo/url-shortener.git
```
2. Install dependencies:
```bash
npm install
```

1. Set up environment variables: .env.local
```bash
DATABASE_URL=
# Fill in your own domain: if running locally leave it as is
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
Set up environment variables: .env
```bash
# This is duplicative but required for prisma
DATABASE_URL=
```

1. Start the development server:
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the application.

## API Usage
Create a shortened URL:
```bash
POST /api/shorten
{
  "url": "https://your-long-url.com",
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
