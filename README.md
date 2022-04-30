# APP

APP para el proyecto fin de ciclo de los módulos DAM y ASIR en Birt. Curso 2º cuatrimestre 2021-2022

## Repositorio

[Enlace: ](https://github.com/DAMASIR/APP)

## Requisitos técnicos

### Desarrollo

* Ionic 6.19.0 (previa instalación de Node.js)
* Git para acceder al repositorio de Github
* IDE, recomendado Visual Studio Code

## Ejecución en entorno de pruebas

Para instalar las dependencias de la aplicación, ejecutar en un terminal dentro de la carpeta de la misma: 
npm install

Para probar la aplicación en el navegador, ejecutar también dentro de la carpeta de la aplicación:
ionic serve

Para detener la ejecución de la aplicación:
Ctrl+c

## Guía de usuario

En la pantalla principal aparece el listado de empresas seleccionables para presentar los gráficos. Para crear los gráficos hay que seleccionar 3 de ellas, pero deben tener cotizaciones compatibles, es decir deben tener el mismo rango y las mismas fechas de cotización. Las cotizaciones se pueden recargar de 10 en 10 mediante un botón, hasta que no queden más.

En el propio listado podemos acceder a la edición de las empresas mediante un sliding. Desde la pantalla de edición de empresa podremos acceder al listado de cotizaciones de la misma, y desde allí podremos editarlas mediante otro sliding, o crearlas mediante un botón.

La mayoría de las empresas no contienen cotizaciones todavía. Las empresas con datos compatibles son las siguientes: Apple, BMW, Ducati, Fanta, Google e Ikea.
Para hacer pruebas, la empresa BASF tiene cotizaciones compatibles en la primera recarga, y la empresa Adidas tiene cotizaciones totalmente incompatibles con el resto de empresas.

Por otro lado se pueden crear y eliminar empresas, y también cotizaciones. Si queréis probar a eliminar alguna empresa, primero crear alguna nueva y después eliminarla, ya que las empresas del listado tienen el enlace del logo ya incorporado.

Por último también se puede probar el funcionamiento del buscador y el scroll infinito.