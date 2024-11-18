class AttemptHandler {
  /**
   * @param {SingleState} state
   * @param {number} [maxTries=2]
   */
    constructor(state, maxTries = 2) {
      this.state = state;
      this.maxTries = maxTries;
    }

    async cleanTries() {
      await this.state.update({ tries: null });
    }

    getTries() {
      const myState = this.state.getMyState();
      const tries = myState?.tries;
      return tries;
    }

    async excedTries() {
      const myTries = this.getTries();
      // Verificar si se alcanzan los intentos máximos
      const excedTries = myTries >= this.maxTries ? true : false;
      if (excedTries) await this.state.update({ tries: null });
      return excedTries;
    }

    // Actualizar el estado de intentos
    async updateTries() {
      // Validar si tries es un valor número y en caso de no serlo, asignarlo a 1
      if (isNaN(this.getTries())) {
        await this.state.update({ tries: 1 });
      } else {
      await this.state.update({ tries: this.getTries() + 1 });
      }
    }

    async handleTries() {
      const myState = this.state.getMyState();
      const tries = myState?.tries;
       console.log(tries)
  
      if (!tries) {
        await this.state.update({ tries: 1 });
      } else if (tries < this.maxTries) {
        await this.state.update({ tries: tries + 1 });
      }
  
      // Verificar si se alcanzan los intentos máximos
      if (this.state.getMyState()?.tries >= this.maxTries) {
        await this.state.update({tries:null})
        
       
        console.log("Máximo de intentos alcanzado.");
        return true;
      }
      
      return false;
      
    }
  }

  export default AttemptHandler;