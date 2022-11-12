import React, { useEffect, useState } from "react";
import Phaser from 'phaser';
import Escena from './components/Escena';

function App(){

    const[Listo, setListo] = useState(false);

    useEffect(()=>{

        //Estas con las configuraciones.
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 200 }
            }
        },
        scene:[Escena]
    };

       //Aqui comienza nuestro juego.
       var game = new Phaser.Game(config);

       //Este es un rigger para cuando el jeugo este completamente listo
       game.events.on("Listo", setListo)
   
       return() =>{
           setListo(false);
           game.destroy(true);
       }

    },[Listo]);

}

export default App;