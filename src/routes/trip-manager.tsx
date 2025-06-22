import { createFileRoute } from '@tanstack/react-router'
import TripManager from '../components/trips/TripManager'

export const Route = createFileRoute('/trip-manager')({
    component: () => <TripManager />,
})