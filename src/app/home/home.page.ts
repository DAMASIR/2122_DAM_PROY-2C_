import { Component, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  items = [];
  toggle = "Detener scroll infinito";
  cargas = 4;
  contador = 1;

  public checkeds = 0;
  public limit = 3;

  constructor(public alertController: AlertController) {
    this.addMoreItems(this.contador);
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.addMoreItems(this.contador);
      this.cargas -= 1;
      console.log(this.cargas);
      event.target.complete();
    }, 1000);
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    if(this.toggle == "Detener scroll infinito"){
      this.toggle = "Activar scroll infinito";
    } else {this.toggle = "Detener scroll infinito"}
  }

  comprobar(seleccionado) {
    if (!seleccionado.isChecked){
      this.checkeds++;
      console.log(this.checkeds);
    } else {
      this.checkeds--;
      console.log(this.checkeds);
    }
  }

  addMoreItems(contador: number){
    for(let i = contador; i < contador + 20; i++){
      this.items.push({nombre: 'Empresa ' + i, isChecked: false});
    }
    this.contador += 20;
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmar!',
      message: '¿Esta seguro que quiere eliminar la <strong>empresa</strong>?!!!',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Operacion cancelada');
          }
        }, {
          text: 'Eliminar',
          id: 'confirm-button',
          handler: () => {
            console.log('Confirmar Eliminar Empresa');
          }
        }
      ]
    });

    await alert.present();
  }

}
