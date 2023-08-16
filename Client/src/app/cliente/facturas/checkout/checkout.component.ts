import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Route } from '@angular/router';
import { id } from '@swimlane/ngx-charts';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { filter, map, Subject, Subscription, takeUntil } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { CartService } from 'src/app/share/cart.service';
import { DialogDireccionComponent } from 'src/app/share/dialog-direccion/dialog-direccion.component';
import { DialogTarjetaComponent } from 'src/app/share/dialog-tarjeta/dialog-tarjeta.component';
import { GenericService } from 'src/app/share/generic.service';
import { NotificacionService, TipoMessage } from 'src/app/share/notification.service';
import { ProvinceService } from 'src/app/share/provinces.services';
import { UserService } from 'src/app/share/user.service';
import { creditCardValidator } from 'src/app/share/utils/app-validators';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  stepperOrientation: 'horizontal' | 'vertical' = "horizontal";
  billingForm: FormGroup;
  months = [];
  years = [];
  // deliveryMethods = [];
  grandTotal = 0;
  makeSubmit: boolean = false;
  watcher: Subscription;
  cartList = [];
  user: any;

  destroy$: Subject<boolean> = new Subject<boolean>();
  infoTarjeta: any;
  tarjetas: any[];
  direcciones: any[];
  infoDireccion: any;
  provincias: any[] = [];
  cantones: any;
  distritos: any;
  cantonSeleccionado: any;
  distritoSeleccionado: any;
  provinciaSeleccionada: any;


  constructor(public router: Router, private gService: GenericService,
    private noti: NotificacionService, public appService: AppService,
    public formBuilder: UntypedFormBuilder,
    public mediaObserver: MediaObserver,
    public userService: UserService,
    public cartService: CartService,
    private dialog: MatDialog,
    public provinceService: ProvinceService) {

    this.watcher = mediaObserver.asObservable()
      .pipe(filter((changes: MediaChange[]) => changes.length > 0), map((changes: MediaChange[]) => changes[0]))
      .subscribe((change: MediaChange) => {
        if (change.mqAlias == 'xs') {
          this.stepperOrientation = 'vertical';
        }
        else if (change.mqAlias == 'sm') {
          this.stepperOrientation = 'vertical';
        }
        else if (change.mqAlias == 'md') {
          this.stepperOrientation = 'horizontal';
        }
        else {
          this.stepperOrientation = 'horizontal';
        }
      });
  }


  ngOnInit() {
    this.direcciones = [];
    this.tarjetas = [];
    this.user = this.userService.currentUserValue;
    let id = this.user.userId;
    this.obtenerTarjetas(id);
    this.obtenerDirecciones(id);
    this.cartList = this.cartService.getItems;
    this.months = this.appService.getMonths();
    this.years = this.appService.getYears();
    // this.deliveryMethods = this.appService.getDeliveryMethods();
    this.reactiveForm();
    this.loadProvincias();


  }
  openPDF() {
    //htmlData: id del elemento HTML
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      //Configuración del ancho y alto del Canvas de la imagen
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      //devuelve un data URI,el cual contiene una representación
      // de la imagen en el formato especificado por el parámetro type
      const FILEURI = canvas.toDataURL('image/png');
      //Orientación, unidad, formato
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      //Agregar imagen al PDF
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('reporte.pdf');
    });
  }
  reactiveForm() {
    this.billingForm = this.formBuilder.group({
      provincia: ['', Validators.required],
      canton: ['', Validators.required],
      distrito: ['', Validators.required],
      zip: ['', Validators.required],
      otrasSennas: ['', [Validators.required, Validators.minLength(10)]],
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, creditCardValidator]],
      expiredMonth: ['', Validators.required],
      expiredYear: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      // deliveryMethod: [this.deliveryMethods[0], Validators.required]

    });
  }

  registrarOrden() {

    if (this.cartService.getItems != null) {

      if (!this.billingForm.valid) {
        this.noti.mensaje('Orden',
          'Complete los campos requeridos',
          TipoMessage.warning)
        return;
      }

      //Obtener los items del carrito de compras
      let itemsCarrito = this.cartService.getItems;

      let detalles = itemsCarrito.map(
        x => ({
          ['cantidad']: x.cantidad,
          ['precioUnitario']: x.precio,
          ['productoId']: x.product.id,
          ['estadoPedidoId']: 1,
        })
      )

      //Armar la estructura de la tabla intermedia
      //[{'videojuegoId':valor, 'cantidad':valor}]

      //Datos para el API
      let infoOrden = {
        'EncabezadoFactura': {
          'fechaCompra': new Date(),
          'usuarioId': this.user.userId,
          'numTarjeta': this.billingForm.controls['cardNumber'].value.slice(-4),
          'subtotal': this.cartService.getTotal(),
          'total': this.cartService.getTotal(),
          'metodoPagoId': this.infoTarjeta ? this.infoTarjeta.id : null,
          'idDireccion': this.infoDireccion ? this.infoDireccion.id : null,
        },
        'DetallesFactura': {
          'detalles': detalles
        },
        'Direccion': null,
        'MetodoPago': null,


      }
      if (this.infoDireccion == null) {
        infoOrden.Direccion = {
          'provincia': this.billingForm.controls['provincia'].value,
          'canton': this.billingForm.controls['canton'].value,
          'distrito': this.billingForm.controls['distrito'].value,
          'otrasSennas': this.billingForm.controls['otrasSennas'].value,
          'zip': this.billingForm.controls['zip'].value,
          'usuarioId': this.user.userId,
        }
      }
      if (this.infoTarjeta == null) {

        infoOrden.MetodoPago = {
          'numTarjeta': this.billingForm.controls['cardNumber'].value,
          'propietarioTarjeta': this.billingForm.controls['cardHolderName'].value,
          'mesVencimiento': this.billingForm.controls['expiredMonth'].value,
          'anioVencimiento': parseInt(this.billingForm.controls['expiredYear'].value),
          'cvv': this.billingForm.controls['cvv'].value,
        }


      }
      this.gService.create('facturas/', infoOrden)
        .subscribe((respuesta: any) => {
          this.noti.mensaje("Factura", respuesta.message,
            TipoMessage.success)
          this.cartService.deleteCart();
          // this.total=this.cartService.getTotal();
          console.log(respuesta)
          this.openPDF();
        })
    } else {
      this.noti.mensaje('Orden',
        'Agregue productos a la orden',
        TipoMessage.warning)
    }
  }

  async abrirDialogoTarjetas() {


    const dialogRef = this.dialog.open(DialogTarjetaComponent, {
      data: this.tarjetas,
      //width auto se ajusta al contenido
      width: '500px',
      //height auto se ajusta al contenido
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.infoTarjeta = result;
        console.log(this.infoTarjeta);

        this.billingForm.controls['expiredMonth'].setValue(this.infoTarjeta.mesVencimiento);
        this.billingForm.controls['expiredYear'].setValue(this.infoTarjeta.anioVencimiento.toString());
        this.billingForm.controls['cardHolderName'].setValue(this.infoTarjeta.propietarioTarjeta);
        this.billingForm.controls['cardNumber'].setValue(this.infoTarjeta.numTarjeta);
        this.billingForm.controls['expiredMonth'].disable();
        this.billingForm.controls['expiredYear'].disable();
        this.billingForm.controls['cardHolderName'].disable();
        this.billingForm.controls['cardNumber'].disable();

      }
    });
  }
  async abrirDialogDireccion() {


    const dialogRef = this.dialog.open(DialogDireccionComponent, {
      data: this.direcciones,
      //width auto se ajusta al contenido
      width: '500px',
      //height auto se ajusta al contenido
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.infoDireccion = result;
        console.log(this.infoDireccion);
        this.billingForm.controls['provincia'].setValue(this.infoDireccion.provincia);
        await this.onProvinceChange();
        this.billingForm.controls['canton'].setValue(this.infoDireccion.canton);
        this.onCantonChange();
        this.billingForm.controls['distrito'].setValue(this.infoDireccion.distrito);
        this.billingForm.controls['zip'].setValue(this.infoDireccion.codPostal);
        this.billingForm.controls['otrasSennas'].setValue(this.infoDireccion.sennas);

        this.billingForm.controls['provincia'].disable();
        this.billingForm.controls['canton'].disable();
        this.billingForm.controls['distrito'].disable();
        this.billingForm.controls['zip'].disable();
        this.billingForm.controls['otrasSennas'].disable();


      }
    });
  }

  public errorHandling = (control: string, error: string) => {
    return (
      this.billingForm.controls[control].hasError(error) &&
      this.billingForm.controls[control].invalid &&
      (this.makeSubmit || this.billingForm.controls[control].touched)
    );
  };

  obtenerTarjetas(id: number) {
    this.gService.get('metodopago/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (tarjetas) => {
          this.tarjetas = tarjetas;
        },
        (error) => {
          console.error('Error al obtener las tarjetas', error);
        }
      );
  }
  obtenerDirecciones(id: number) {
    this.gService.get('direccion/', id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (direcciones) => {
          this.direcciones = direcciones;
        },
        (error) => {
          console.error('Error al obtener las direcciones', error);
        }
      );
  }



  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public placeOrder() {
    this.horizontalStepper._steps.forEach(step => step.editable = false);
    this.appService.Data.cartList.length = 0;
    this.appService.Data.totalPrice = 0;
    this.appService.Data.totalCartCount = 0;

  }


  async loadProvincias() {
    try {
      const data: any = await this.provinceService.getProvinces();
      for (const key in data) {
        this.provincias.push({ id: key, name: data[key] });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async onProvinceChange() {
    this.cantones = [];
    this.distritos = [];
    this.cantonSeleccionado = '';
    const selectedProvinceName = this.billingForm.get('provincia').value;
    const selectedProvince = this.provincias.find(provincia => provincia.name === selectedProvinceName);

    if (selectedProvince) {
      this.provinciaSeleccionada = selectedProvince;
      try {
        const data: any = await this.provinceService.getCantons(
          selectedProvince.id
        );
        for (const key in data) {
          this.cantones.push({ id: key, name: data[key] });
        }
      } catch (error) {

      }
    }
  }

  async onCantonChange() {
    this.distritos = [];
    const selectedProvinceName = this.billingForm.get('provincia').value;
    const selectedProvince = this.provincias.find(provincia => provincia.name === selectedProvinceName);
    const selectedCantonName = this.billingForm.get('canton').value;
    const selectedCanton = this.cantones.find(canton => canton.name === selectedCantonName);

    if (selectedCanton && selectedProvince) {
      this.cantonSeleccionado = selectedCanton;
      this.provinciaSeleccionada = selectedProvince;
      try {
        const data: any = await this.provinceService.getDistritos(
          selectedProvince.id,
          selectedCanton.id
        );
        for (const key in data) {
          this.distritos.push({ id: key, name: data[key] });
        }
      } catch (error) {

      }
    }
  }

  deleteInfoDireccion() {
    this.infoDireccion = null;
    this.billingForm.controls['provincia'].enable();
    this.billingForm.controls['canton'].enable();
    this.billingForm.controls['distrito'].enable();
    this.billingForm.controls['zip'].enable();
    this.billingForm.controls['otrasSennas'].enable();

    this.billingForm.controls['provincia'].setValue('');
    this.billingForm.controls['canton'].setValue('');
    this.billingForm.controls['distrito'].setValue('');
    this.billingForm.controls['zip'].setValue('');
    this.billingForm.controls['otrasSennas'].setValue('');


  }

  deleteInfoTarjeta() {
    this.infoTarjeta = null;

    this.billingForm.controls['expiredMonth'].enable();
    this.billingForm.controls['expiredYear'].enable();
    this.billingForm.controls['cardHolderName'].enable();
    this.billingForm.controls['cardNumber'].enable();

    this.billingForm.controls['expiredMonth'].setValue('');
    this.billingForm.controls['expiredYear'].setValue('');
    this.billingForm.controls['cardHolderName'].setValue('');
    this.billingForm.controls['cardNumber'].setValue('');


  }
}
