export default class Debitmetre {
    constructor(consigne, identifiant) {
      this.consigne = consigne;
      this.volume = 0;
      this.tempsRestant = new Date();
      this.tempsDebut = new Date();
      this.interval = 500;
      this.turbine;
      this.identifiant = identifiant || 'turbine';
    }
  
    consigneAtteinte() {
      if (this.volume >= this.consigne) {
        console.log(this.identifiant, 'Volume atteint : ', this.volume);
        return true;
      }
      return false;
    }
  
    start() {
      this.tempsDebut = new Date();
      console.log(this.identifiant, ' Start heure :', this.tempsDebut);
    }
  
    pause() {
      this.tempsRestant = this.interval - (new Date() - this.tempsDebut);
      console.log('Pause, temps restant : ', this.tempsRestant);
      return true;
    }
  
    stop() {
      console.log('Stop : ', this.volume);
    }
  
    calculVolume() {
      this.volume++;
      console.log(this.identifiant, 'Volume en cours : ', this.volume);
    }
  
    pulse() {
      this.turbine = setInterval(() => {
        console.log(this.consigne, this.volume);
        this.calculVolume();
        if (this.consigneAtteinte()) clearInterval(this.turbine);
      }, this.interval);
    }
  }