# GCO-SYSTEM – Documento de Integración FrontEnd y Backend Momento 3

## 1. Descripción de la integración

GCO-SYSTEM es una aplicación FrontEnd para la gestión de medicamentos y laboratorios farmacéuticos, desarrollada utilizando HTML, CSS y JavaScript.

Actualmente, la aplicación obtiene y administra la información mediante solicitudes HTTP realizadas con Fetch API a MockAPI, que funciona como servicio de simulación.

En el Nivel 3 del proyecto se espera reemplazar este servicio simulado por una API REST desarrollada con Java y Spring Boot, conectada a una base de datos que permita almacenar y gestionar la información de manera persistente.

El objetivo de esta integración es establecer la comunicación entre el FrontEnd y el Backend mediante solicitudes HTTP, permitiendo consultar, registrar, actualizar y eliminar información de medicamentos y laboratorios.

## 2. Arquitectura de integración

La comunicación propuesta entre los componentes del sistema será:

```text
          FRONTEND
     HTML + CSS + JavaScript
                |
                |
             Fetch API
                |
                |
           HTTP / JSON
                |
                |
          BACKEND
        Java + Spring Boot
                |
                |
          API REST
                |
                |
           BASE DE DATOS
```

El FrontEnd será responsable de presentar la información y permitir la interacción del usuario.

El Backend será responsable de procesar las solicitudes, aplicar las reglas de negocio y gestionar la información almacenada en la base de datos.

## 3. Servicios actuales de MockAPI

Durante el desarrollo del Momento 3 se utilizan los siguientes endpoints para simular la comunicación con el servidor.

| Recurso | Método HTTP | URL actual | Funcionalidad |
|---|---|---|---|
| Laboratorios | GET | `https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Laboratorios` | Consultar laboratorios. |
| Medicamentos | GET | `https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Medicamentos` | Consultar medicamentos. |
| Medicamentos | POST | `https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Medicamentos` | Registrar medicamentos. |

Estos servicios permiten probar el consumo asíncrono de información y la actualización dinámica de la interfaz.

## 4. Endpoints esperados para Spring Boot – Nivel 3

Para la futura integración se propone que el equipo de Backend desarrolle una API REST con los siguientes endpoints.

### 4.1. Gestión de laboratorios

| Método HTTP | Endpoint esperado | Descripción |
|---|---|---|
| GET | `/api/laboratorios` | Obtener todos los laboratorios registrados. |
| GET | `/api/laboratorios/{id}` | Consultar un laboratorio por su identificador. |
| POST | `/api/laboratorios` | Registrar un nuevo laboratorio. |
| PUT | `/api/laboratorios/{id}` | Actualizar la información de un laboratorio. |
| DELETE | `/api/laboratorios/{id}` | Eliminar un laboratorio. |

### 4.2. Gestión de medicamentos

| Método HTTP | Endpoint esperado | Descripción |
|---|---|---|
| GET | `/api/medicamentos` | Obtener todos los medicamentos registrados. |
| GET | `/api/medicamentos/{id}` | Consultar un medicamento por su identificador. |
| POST | `/api/medicamentos` | Registrar un nuevo medicamento. |
| PUT | `/api/medicamentos/{id}` | Actualizar la información de un medicamento. |
| DELETE | `/api/medicamentos/{id}` | Eliminar un medicamento. |

**Nota:** Los endpoints anteriores son una propuesta de contrato de integración para el Nivel 3. Su implementación y nomenclatura definitiva deberán acordarse con el equipo de Backend.

## 5. Estructura de datos esperada

Para garantizar la comunicación entre el FrontEnd y el Backend, se propone mantener una estructura JSON compatible con los datos utilizados actualmente en MockAPI.

### 5.1. Objeto laboratorio

Ejemplo de respuesta:

```json
{
  "id": 1,
  "nombre": "Genfar",
  "ciudad": "Medellín",
  "pais": "Colombia"
}
```

### 5.2. Objeto medicamento

Ejemplo de respuesta:

```json
{
  "id": 1,
  "nombre": "Acetaminofén",
  "precio": 5000,
  "laboratorio_id": 1,
  "estado_activo": true
}
```

### 5.3. Registro de un medicamento

Para registrar un medicamento, el FrontEnd enviará una solicitud POST con el siguiente cuerpo JSON:

```json
{
  "nombre": "Acetaminofén",
  "precio": 5000,
  "laboratorio_id": 1,
  "estado_activo": true
}
```

El Backend deberá procesar la información, almacenarla y devolver una respuesta con los datos del medicamento creado, incluyendo su identificador.

## 6. Configuración de las URLs en el FrontEnd

Actualmente, las direcciones de MockAPI se encuentran declaradas en el archivo `catalogo.js` mediante las siguientes variables:

```javascript
const gco_urlLaboratorios =
    "https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Laboratorios";

const gco_urlMedicamentos =
    "https://6af31f07d2377d6c370489b7.mockapi.io/api/v1/Medicamentos";
```

Cuando el Backend desarrollado en Spring Boot esté disponible, se deberán reemplazar estas direcciones por las URLs proporcionadas por el equipo de Backend.

Ejemplo de configuración futura, suponiendo que el servidor se ejecute localmente en el puerto 8080:

```javascript
const gco_urlLaboratorios =
    "http://localhost:8080/api/laboratorios";

const gco_urlMedicamentos =
    "http://localhost:8080/api/medicamentos";
```

De esta manera, el FrontEnd podrá realizar las solicitudes directamente al servidor Spring Boot sin depender de MockAPI.

## 7. Proceso de comunicación entre FrontEnd y Backend

El proceso de integración funcionará de la siguiente manera:

1. El usuario ingresa a la aplicación GCO-SYSTEM.
2. JavaScript ejecuta las solicitudes Fetch API.
3. El FrontEnd envía peticiones HTTP a los endpoints del Backend.
4. Spring Boot recibe y procesa las solicitudes.
5. El Backend consulta o modifica la información en la base de datos.
6. Spring Boot devuelve una respuesta en formato JSON.
7. JavaScript recibe y procesa la respuesta.
8. El DOM se actualiza dinámicamente para mostrar los resultados al usuario.

## 8. Consideraciones para la integración

Para garantizar el correcto funcionamiento de la comunicación entre ambos componentes, se deberán tener en cuenta los siguientes aspectos:

- El Backend deberá proporcionar los endpoints REST acordados.
- Las respuestas deberán manejar un formato JSON compatible con el FrontEnd.
- Los nombres y tipos de los atributos deberán mantenerse consistentes.
- El Backend deberá permitir las solicitudes HTTP desde el origen del FrontEnd mediante la configuración correspondiente de CORS.
- Se deberán controlar los códigos de respuesta HTTP para identificar operaciones exitosas y errores.
- Las operaciones POST y PUT deberán recibir información en formato JSON.
- Los identificadores de laboratorios y medicamentos deberán permitir establecer correctamente sus relaciones.
- El FrontEnd deberá conservar el manejo de errores mediante `try...catch` y la actualización dinámica del DOM.

## 9. Conclusión

La implementación actual de GCO-SYSTEM mediante MockAPI permite establecer las bases de comunicación asíncrona entre el FrontEnd y un servicio externo.

La utilización de Fetch API facilita el consumo de recursos HTTP, mientras que JavaScript permite procesar las respuestas JSON y actualizar dinámicamente la interfaz.

Para el Nivel 3 se espera reemplazar MockAPI por una API REST desarrollada con Spring Boot, que permita conectar la aplicación con una base de datos y administrar la información de medicamentos y laboratorios de manera persistente.

Esta estructura de integración permitirá evolucionar el proyecto hacia una arquitectura cliente-servidor, manteniendo la separación de responsabilidades entre el FrontEnd y el Backend.

---

**Proyecto:** GCO-SYSTEM v1.0  
**Entrega:** Momento 3 – Documento de Integración  
**FrontEnd:** HTML, CSS y JavaScript  
**Consumo de servicios:** Fetch API  
**Servicio simulado actual:** MockAPI  
**Backend esperado:** Java – Spring Boot – API REST  
**Formato de intercambio:** JSON
