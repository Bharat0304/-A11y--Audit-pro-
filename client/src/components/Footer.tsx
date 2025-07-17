import React from "react";
import { useAppSelector } from '../store/hooks';

const Footer = () => {
    const theme = useAppSelector(state => state.ui.theme);

    return (
        <footer className={`text-center text-sm py-6 border-t mt-8 transition-colors duration-300 ${theme === 'dark'
            ? 'text-gray-400 border-gray-700 bg-gray-900'
            : 'text-gray-500 border-gray-300 bg-white'
            }`}>
            {/* A11y Audit Pro Logo */}
            <div className="flex justify-center mb-4">
                <img
                    src="/images/a11y-audit-pro-logo.png"
                    alt="A11y Audit Pro Logo"
                    className="h-20 object-contain"
                />
            </div>

            <p>
                Developed by{" "}
                <strong className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-black'
                    }`}>Daksh Malhotra</strong> &{" "}
                <strong className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-100' : 'text-black'
                    }`}>Bharat Kumar</strong>
            </p>
            <p>&copy; 2025 Daksh Malhotra & Bharat Kumar. All rights reserved.</p>
            <p>
                Contact:{" "}
                <a
                    href="https://dakshmalhotra.dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`underline transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm ${theme === 'dark'
                        ? 'hover:text-blue-400 focus:ring-offset-gray-900'
                        : 'hover:text-blue-600 focus:ring-offset-white'
                        }`}
                >
                    dakshmalhotra.dev
                </a>{" "}
                |{" "}
                <a
                    href="mailto:iamdakshmalhotra@gmail.com"
                    className={`underline transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm ${theme === 'dark'
                        ? 'hover:text-blue-400 focus:ring-offset-gray-900'
                        : 'hover:text-blue-600 focus:ring-offset-white'
                        }`}
                >
                    iamdakshmalhotra@gmail.com
                </a>
            </p>
        </footer>
    );
};

export default Footer;
