import { createFileRoute } from '@tanstack/react-router'
import TripManagement from '../components/TripManagement'

export const Route = createFileRoute('/trip-management')({
    component: () => <TripManagement />,
})