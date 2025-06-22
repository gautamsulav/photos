import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import {TanStackRouterDevtools} from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
    component: () => (
        <div>
            <nav style={{
                padding: '1rem',
                borderBottom: '1px solid #ccc',
                display: 'flex',
                gap: '1rem'
            }}>
                <Link
                    to="/trip-management"
                    style={{
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        color: '#0066cc',

                        borderRadius: '4px'
                    }}
                >
                    Trip Management
                </Link>
                <Link
                    to="/photo-gallery"
                    style={{
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        color: '#0066cc',
                        borderRadius: '4px'
                    }}
                >
                    Photo Gallery
                </Link>
                <Link
                    to="/trip-manager"
                    style={{
                        padding: '0.5rem 1rem',
                        textDecoration: 'none',
                        color: '#0066cc',

                        borderRadius: '4px'
                    }}
                >
                    Trip Manager
                </Link>
            </nav>
            <main style={{ padding: '1rem' }}>
                <Outlet />
            </main>
            <TanStackRouterDevtools />
        </div>
    ),
})