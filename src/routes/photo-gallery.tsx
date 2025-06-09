import { createFileRoute } from '@tanstack/react-router'
import PhotoGallery from '../components/PhotoGallery'

export const Route = createFileRoute('/photo-gallery')({
    component: () => <PhotoGallery />,
})