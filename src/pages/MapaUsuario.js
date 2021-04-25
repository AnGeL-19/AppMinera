import React, { useContext, useEffect } from "react";
import { SocketContext } from "../context/SocketContext";
import { useMapbox, seleccionarSona, activarEntrega, seleccionarCarro } from "../hooks/useMapbox";

const puntoInicial = {
  lng: -109.02089,
  lat: 27.16125,
  zoom: 15,
};

export const MapaUsuario = () => {
  const {
    agregarSona,
    agregarLayers,
    nuevaSona$,
    setRef,
    coords,
    nuevoMarcador$,
    movimientoMarcador$,
    agregarMarcador,
    actualizarPosicion,
  } = useMapbox(puntoInicial);
  const { socket } = useContext(SocketContext);

  //Agregar nueva sona
  useEffect(() => {
    nuevaSona$.subscribe((sona) => {
      socket.emit("sona-nueva", sona);
    });
  }, [nuevaSona$, socket]);

  useEffect(
    (ev) => {
      socket.on("sona-nueva", (sona) => {
        seleccionarCarro(true);
        agregarSona(ev, sona);
        seleccionarCarro(false);
      });
    },
    [socket, agregarSona, seleccionarCarro]
  );

  useEffect(
    (ev) => {
      socket.on("sonas-activas", (sonas) => {
        if(!(sonas.lenght === 0 || sonas === null || !sonas)){
          console.log(sonas , "desde sonas activas");
          agregarLayers(sonas);
        }
      });
    },
    [agregarSona,socket,agregarLayers]
  );

  // Escuchar los marcadores existentes
  useEffect(() => {
    socket.on("marcadores-activos", (marcadores) => {
      for (const key of Object.keys(marcadores)) {
        agregarMarcador(marcadores[key], key);
      }
    });
  }, [socket, agregarMarcador]);

  // Nuevo marcador
  useEffect(() => {
    nuevoMarcador$.subscribe((marcador) => {
      console.log(marcador, "--------");
      socket.emit("marcador-nuevo", marcador);
    });
  }, [nuevoMarcador$, socket]);

  // Movimiento de Marcador
  useEffect(() => {
    movimientoMarcador$.subscribe((marcador) => {
      socket.emit("marcador-actualizado", marcador);
    });
  }, [socket, movimientoMarcador$]);

  // Mover marcador mediante sockets
  useEffect(() => {
    socket.on("marcador-actualizado", (marcador) => {
      actualizarPosicion(marcador);
    });
  }, [socket, actualizarPosicion]);

  // Escuchar nuevos marcadores
  useEffect(() => {
    socket.on("marcador-nuevo", (marcador) => {
      agregarMarcador(marcador, marcador.id);
    });
  }, [socket, agregarMarcador]);


  const addEntrega = () => {
    console.log("marcar entrega");
  }

  const addCarga = () => {
    console.log("Cargado");
  }


  return (
    <>

      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>

      <div ref={setRef} id="id" />
      <div className="sidebar">
        <div className="heading">
          <h1>Routes</h1>
        </div>
        <div id="reports" className="reports"></div>
      </div>


      <button className="btn btn-3" 
              onClick={addEntrega}
              disabled={activarEntrega()}>
        Entrega
      </button>
      <button className="btn btn-2" 
              onClick={addCarga}>
        Carga
      </button>

      <div className="formulario">
        <span className="encabezado">Cargar vehiculo</span>
        <form>
          <label>
            Material:
            <input type="text" name="name" />
          </label>
          <label>
            Cantidad:
            <input type="text" name="name" />
          </label>
          
          <button>Guardar</button>
        </form>
      </div>

    </>
  );
};
