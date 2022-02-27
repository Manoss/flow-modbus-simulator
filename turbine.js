import EventEmitter from 'events'

export default class Debitmetre extends EventEmitter{
    constructor(consigne, identifiant) {
      super();
      this.consigne = consigne;
      this.volume = 0;
      this.tempsRestant = new Date();
      this.tempsDebut = new Date();
      this.interval = 500;
      this.turbine;
      this.identifiant = identifiant || 'turbine';
    }
  
    _consigneAtteinte() {
      if (this.volume >= this.consigne) {
        this.emit("consigneAtteinte", this.volume)
        return true;
      }
      return false;
    }

    _incrementVolume() {
      this.volume++;
      this.emit("volumeEnCours", this.volume)
    }

    _pulse() {
      this.turbine = setInterval(() => {
        this._incrementVolume();
        if (this._consigneAtteinte()) {
          clearInterval(this.turbine);
          this.stop()
        }
      }, this.interval);
    }
  
    start() {
      this.emit("start");
      this._pulse();
    }
  
    pause() {
      this.tempsRestant = this.interval - (new Date() - this.tempsDebut);
      console.log('Pause, temps restant : ', this.tempsRestant);
      this.emit("pause")
    }
  
    stop() {
      this.emit("stop")
    }
  }