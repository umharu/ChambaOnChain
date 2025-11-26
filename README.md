# Chamba on Chain

Chamba on Chain es una DApp educativa pensada para acercar a los jóvenes al mundo del trabajo y la tecnología blockchain. La misma fue desarrollada por alumnos de ET N°6 Fernando Fader, ET N°20 y ET N°37 Hogar Naval Stella Maris, en el contexto de Practicas profesionalizantes 2025.   
El proyecto permite que los estudiantes creen su portfolio descentralizado subiendo archivos (como proyectos, CV o certificados) a la blockchain e IPFS, generando así una identidad profesional verificable en Web3.  
Además, las empresas pueden contactarlos directamente para ofrecerles su primera experiencia laboral.

---

## 🎯 Objetivo del proyecto

Brindar a los estudiantes una herramienta práctica para:

- Adquirir conceptos fundamentales sobre blockchain.
- Identificar una problemática escolar cotidiana e iniciar el desarrollo de un producto basado en tecnología Ethereum para darle solución.
- Adquirir experiencia sobre desarrollo y gestión de productos Web3, a través del proyecto desarrollado durante la práctica.
- Crear y almacenar de forma segura sus logros académicos y proyectos.
- Conectar con empresas que buscan jóvenes talentos.
- Desarrollar su primer portfolio descentralizado.

---

## 🧰 Tecnologías utilizadas

| Componente | Descripción |
|-----------|-------------|
| Solidity | Desarrollo de los smart contracts que gestionan los archivos y usuarios. |
| Hardhat | Framework para compilar, desplegar y testear contratos en Ethereum. |
| IPFS | Almacenamiento descentralizado de archivos. |
| JavaScript | Lógica del frontend y conexión con los contratos. |
| Ethers.js | Comunicación entre el frontend y la blockchain. |
| HTML / CSS | Interfaz simple y accesible para estudiantes. |

---

## 🛠 Otras herramientas del proyecto

- Github  
- Excalidraw  
- v0 (Vercel)  
- Lucid  
- Metamask  
- Whatsapp  
- Discord  
- Google Suite  

---

## ⚙️ Instalación y ejecución local

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/umharu/ChambaOnChain.git
cd ChambaOnChain
```
2️⃣ Instalar dependencias
```bash
npm install
```
3️⃣ Compilar los contratos
```bash
npx hardhat compile
```
4️⃣ Desplegar en una red de prueba (ej: Sepolia)
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
5️⃣ Ejecutar el frontend
```bash
npm run dev
```
### 🔍 ¿Cómo funciona?

El estudiante conecta su wallet (Metamask).

Sube un archivo, que se guarda en IPFS.

El hash del archivo se registra en la blockchain mediante un smart contract.

Las empresas pueden visualizar los portfolios públicos y contactar a los estudiantes.

### 🚀 Próximos pasos

Mejorar la interfaz con frameworks modernos.

Integrar sistema de reputación o validación.

Conexionar con plataformas de empleo Web3.

### 👥 Equipo

Proyecto educativo desarrollado por estudiantes de último año dentro del programa:

“Prácticas Profesionalizantes — ETH-Kipu”

## Hecho con ❤️ “Chamba on Chain” 

