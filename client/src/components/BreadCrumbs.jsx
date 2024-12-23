// eslint-disable-next-line no-unused-vars
import React from 'react';

// reference: https://postsrc.com/components/tailwind-css-breadcrumbs/basic-breadcrumbs-component
export const BreadCrumbs = ({ crumbs }) => {
    return (
        <div className="bg-black p-4 flex items-center flex-wrap">
            <ul className="flex items-center">
                {crumbs.map((crumb, index) => (
                    <li key={index} className="inline-flex items-center">
                        {/* Check if it's not the last crumb */}
                        {index !== crumbs.length - 1 ? (
                            <>
                                <a href={crumb.href} className="text-gray-600 hover:text-yellow-500">
                                    {crumb.label}
                                </a>
                                <svg
                                    className="w-5 h-auto fill-current mx-2 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M0 0h24v24H0V0z" fill="none" />
                                    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
                                </svg>
                            </>
                        ) : (
                            // Highlight last breadcrumb as active
                            <span className="text-yellow-500">{crumb.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
