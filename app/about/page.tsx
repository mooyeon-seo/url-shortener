// pages/about.tsx
import React from 'react';
import Image from 'next/image';

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
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Challenges and Lessons Learned</h2>
                <ul className="mt-4 list-disc pl-6 text-lg text-gray-600 dark:text-gray-300">
                    <li><b>Docker Networking</b>: Ensuring seamless communication between containers required careful planning. Misconfigurations in Docker networking led to connectivity issues, resulting in errors like "Prisma Client not found" or "Prisma Client not created."</li>
                    <li><b>Prisma Client Initialization</b>: The Prisma client failed to initialize correctly within the Docker environment. Despite running `prisma generate`, the application encountered errors indicating that the Prisma client was not found, suggesting issues with the client generation process inside the container. </li>
                    <li><b>Environment Variable Management</b>: Ensuring that environment variables, such as `DATABASE_URL`, were correctly set within the Docker containers was problematic. Incorrect or missing environment variables led to connection failures between the application and the PostgreSQL database. </li>
                </ul>
            </section>
        </div>
    );
};

export default About;
