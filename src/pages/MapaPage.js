import React, { useContext, useEffect, useState } from "react";

import { SocketContext } from "../context/SocketContext";
import { useMapbox, 
         seleccionarCarro, 
         seleccionarSona,
         seleccionarUsuario,
         informacionCarro } from "../hooks/useMapbox";

const puntoInicial = {
  lng: -109.02089,
  lat: 27.16125,
  zoom: 15,
};

export const MapaPage =  () => {

  useEffect(() => {

    seleccionarUsuario(true);

  },[seleccionarUsuario]);


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
      socket.on("sona-nueva", async (sona) => {
        await seleccionarSona(true);
        agregarSona(ev, sona);
      });
    },
    [socket, agregarSona, seleccionarSona]
  );

  useEffect(
    () => {
      socket.on("sonas-activas", (sonas) => {
        if(!(sonas.lenght === 0 || sonas === null || !sonas)){
          console.log(sonas , "desde sonas activas");
          agregarLayers(sonas);
        }
      });
    },
    [socket,agregarLayers]
  );

  // Escuchar los marcadores existentes
  useEffect( () => {
    socket.on("marcadores-activos", async (marcadores) => {
      for (const marcador of marcadores) {
        await seleccionarCarro(true); 
        agregarMarcador(marcador, marcador.id);
      }
    });
  }, [socket, agregarMarcador, seleccionarCarro]);

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
    socket.on("marcador-nuevo",async (marcador) => {
      await seleccionarCarro(true);
      agregarMarcador(marcador, marcador.id);
    });
  }, [socket, agregarMarcador, seleccionarCarro]);

  const addSona = () => {
    seleccionarSona(true);
    console.log("Agregar sona");
  }

  const addCarro = () => {
    seleccionarCarro(true);
    console.log("Agregar carro");
  }

  const [datos, setDatos] = useState({

    conductor: '',
    tipoCarro: ''

  });


  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name] : e.target.value
    })
  }

  const guardarCarro = (e) => {
    e.preventDefault();
    informacionCarro(datos);
    console.log("conductor ",datos.conductor," carro ",datos.tipoCarro);
  }

  return (
    <>

      <div className="info">
        Lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
      </div>

      <div ref={setRef} id="id" />

      <button className="btn bt-1" onClick={addSona}>
        Poner sona
      </button>
      <button className="btn btn-2" onClick={addCarro}>
        Poner carro
      </button>

      <div className="formulario">

        <form onSubmit={guardarCarro}>

          <input placeholder="Conductor" 
                 name="conductor"  
                 onChange={handleChange} />
          <input placeholder="Tipo carro" 
                 name="tipoCarro"  
                 onChange={handleChange} />

          <button>Guardar</button>

        </form>
        
      </div>

    </>
  );
};
