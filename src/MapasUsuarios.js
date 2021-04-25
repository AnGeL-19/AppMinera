import React from 'react'

import { SocketProvider } from './context/SocketContext'
import { MapaUsuario } from './pages/MapaUsuario'

export const MapasUsuarios = () => {
    return (
        <SocketProvider>
            <MapaUsuario />
        </SocketProvider>
    )
}