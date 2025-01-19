// pages/about.tsx
import React from 'react';
import Image from 'next/image';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Introduction */}
            <section className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Welcome to Our Service</h2>
                <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    Our platform offers a seamless URL shortening service, allowing you to convert long URLs into short, manageable links. Additionally, we provide QR code generation for these shortened URLs, enhancing user engagement and accessibility.
                </p>
            </section>

            {/* How It Works */}
            <section className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">How It Works</h2>
                <div className="mt-4">
                    <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">URL Shortening</h3>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        Simply input your long URL, and our service will generate a unique, shortened link. This makes sharing and managing links more efficient.
                    </p>
                    <h3 className="mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">QR Code Generation</h3>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        For each shortened URL, we provide a corresponding QR code, enabling users to access your content quickly by scanning the code with their devices.
                    </p>
                </div>
            </section>

            {/* Benefits */}
            <section className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Benefits</h2>
                <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">
                    <li><b>Enhanced Shareability</b>: Shortened URLs are easier to share across various platforms.</li>
                    <li><b>Improved User Experience</b>: QR codes provide quick access to content without manual URL entry.</li>
                </ul>
            </section>

            {/* Tech Stack */}
            <section className="mb-12">
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Tech Stack</h2>
                <Image src="/architecture.png" alt="Tech Stack" width={800} height={400} className="rounded" />
                <div className="mt-4">
                    <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">Architecture</h3>
                    <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">
                        <li><b>Frontend and Backend</b>: Next.js is used for the frontend, providing server-side rendering and static site generation capabilities as well as a robust and scalable server environment</li>
                        <li><b>Styling</b>: Tailwind CSS is utilized for styling, providing a responsive and modern design. </li>
                        <li><b>Database</b>The backend employs PostgreSQL for data storage</li>
                        <li><b>Caching</b>: Redis is used for caching to improve performance.</li>
                        <li><b>Reverse Proxy</b>Nginx is used as a reverse proxy to manage incoming requests efficiently.</li>
                    </ul>
                    <h3 className="mt-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">Workflow</h3>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                        Users input a long URL, which is then processed to generate a unique short URL. This mapping is stored in a PostgreSQL database for persistence and cached in Redis for quick retrieval. The application is containerized using Docker, ensuring consistency across development and production environments. Nginx handles incoming requests, directing them to the appropriate service.
                    </p>
                </div>
            </section>

            {/* Challenges and Lessons Learned */}
            <section>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Challenges</h2>
                <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">
                    <li><b>Docker Networking</b>: Ensuring seamless communication between containers required careful planning. Misconfigurations in Docker networking led to connectivity issues, resulting in errors like "Prisma Client not found" or "Prisma Client not created."</li>
                    <li><b>Prisma Client Initialization</b>: The Prisma client failed to initialize correctly within the Docker environment. Despite running `prisma generate`, the application encountered errors indicating that the Prisma client was not found, suggesting issues with the client generation process inside the container. </li>
                    <li><b>Environment Variable Management</b>: Ensuring that environment variables, such as `DATABASE_URL`, were correctly set within the Docker containers was problematic. Incorrect or missing environment variables led to connection failures between the application and the PostgreSQL database. </li>
                </ul>
            </section>
            <section>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mt-3">Lessons</h2>
                <p className="mt-4 list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">I resolved the problem with the following after a full day of debugging:</p>
                <h3 className="text-3xl font-semibold mt-3">Dockerfile</h3>
                <SyntaxHighlighter language="bash" style={dracula} className="rounded-lg p-4 mt-6">
                    {`# Dockerfile
# Stage 1: Install dependencies and build the application
FROM node:20 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json  ./

COPY prisma ./prisma/

# Install dependencies
RUN yarn

# Copy all source code into the container
COPY . .

RUN npx prisma generate

# Build the Next.js application
RUN yarn build

# Stage 2: Production image
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public

# Create an entrypoint script to handle startup
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh

# Expose the port that the app will run on
EXPOSE 3000

# Start the application
ENTRYPOINT ["./docker-entrypoint.sh"]`}
                </SyntaxHighlighter>
                <h3 className="text-3xl font-semibold mt-3">docker-entrypoint.sh</h3>
                <SyntaxHighlighter language="bash" style={dracula} className="rounded-lg p-4 mt-6">
                    {`#!/bin/sh
set -e

# Wait for database to be ready (simple retry mechanism)
echo "Waiting for database..."
for i in $(seq 1 30); do
    npx prisma migrate deploy && break
    echo "Migration attempt $i failed, retrying in 1s..."
    sleep 1
done

# Start the application
exec yarn start`}
                </SyntaxHighlighter>
            </section>
        </div>
    );
};

export default About;
