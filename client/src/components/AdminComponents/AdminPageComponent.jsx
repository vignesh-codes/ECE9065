// eslint-disable-next-line no-unused-vars
import React from 'react'
// reference: https://www.material-tailwind.com/docs/html/sidebar
export const AdminPageComponent = () => {
  return (
    <div>
            <section className="w-screen py-5">
                <div className="mx-auto grid max-w-screen-lg grid-cols-1 gap-5 p-5 sm:grid-cols-2 md:grid-cols-2 lg:gap-10">

                    {/* Manage Products and Orders */}
                    <a href='/admin/manage' className="group h-full overflow-hidden rounded-lg border-2 border-gray-200 border-opacity-60 shadow-lg">
                        <div
                            key={1}
                            className={`flex-shrink-0 w-full h-60 bg-yellow-100 rounded-2xl flex justify-center items-center`}
                        >
                        </div>
                        <div className="py-4 px-6">
                            <h2 className="title-font text-sm font-semibold uppercase tracking-widest text-orange-600">Manage Products and Orders</h2>
                            <h1 className="title-font mb-3 text-xl font-extrabold tracking-wide text-gray-800">Admin Only Access</h1>
                            <p className="line-clamp-6 mb-3 text-gray-500">Manage available stock products and orders here.</p>
                        </div>
                        <div className="flex justify-center px-6 pb-4">
                            <button className="group flex items-center justify-center rounded-md bg-yellow-500 px-6 py-2 text-white transition hover:bg-yellow-600">
                                <span className="font-bold">Manage Products and Orders</span>
                                <svg
                                    className="ml-2 h-6 w-6 transition-transform group-hover:translate-x-1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </a>

                </div>
            </section>
        </div>
  )
}