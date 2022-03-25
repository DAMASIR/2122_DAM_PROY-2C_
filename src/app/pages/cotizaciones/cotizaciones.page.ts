import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-cotizaciones',
  templateUrl: './cotizaciones.page.html',
  styleUrls: ['./cotizaciones.page.scss'],
})
export class CotizacionesPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  items = [];
  toggle = "Detener scroll infinito";
  cargas = 2;
  contador = 1;

  constructor() {
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

  addMoreItems(contador: number){
    for(let i = contador; i < contador + 10; i++){
      this.items.push({nombre: 'Empresa ' + i, isChecked: false});
    }
    this.contador += 10;
  }

  ngOnInit() {
  }

}
