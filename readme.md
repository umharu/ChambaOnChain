# Chamba on Chain

**Chamba on Chain** es una DApp educativa desarrollada por estudiantes de ultimo año nivel secundario, pensada para acercar a los jóvenes al mundo del trabajo y la tecnología blockchain.
El proyecto permite que los estudiantes creen su **portfolio descentralizado** subiendo archivos (como proyectos, CV o certificados) a la **blockchain** e **IPFS**, generando así una identidad profesional verificable en  Web3.
Además, las empresas pueden contactarlos directamente para ofrecerles su **primera experiencia laboral**.

---

## Objetivo del proyecto

Brindar a los estudiantes una herramienta práctica para:

* Aprender sobre **blockchain**.
* Crear y almacenar de forma segura sus logros académicos y proyectos.
* Conectar con **empresas** que buscan jóvenes talentos.
* Desarrollar su **primer portfolio descentralizado**.

---

## Tecnologías utilizadas

| Componente     | Descripción                                                                      |
| -------------- | -------------------------------------------------------------------------------- |
| **Solidity**   | Desarrollo de los smart contracts que gestionan los archivos y usuarios.         |
| **Hardhat**    | Framework para compilar, desplegar y testear los contratos en entornos Ethereum. |
| **IPFS**       | Almacenamiento descentralizado de los archivos del portfolio.                    |
| **JavaScript** | Lógica del frontend y conexión con los contratos inteligentes.                   |
| **Ethers.js**  | Comunicación entre el frontend y la blockchain.                                  |
| **HTML / CSS** | Interfaz web simple y accesible para los estudiantes.                            |

---

## ⚙️ Instalación y ejecución local

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/umharu/ChambaOnChain.git
   cd ChambaOnChain
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Compilar los contratos**

   ```bash
   npx hardhat compile
   ```

4. **Desplegar en una red de prueba (por ejemplo, Sepolia)**

   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

5. **Iniciar el frontend**

   ```bash
   npm run dev
   ```

---

## Cómo funciona

1. El usuario (estudiante) conecta su **wallet** (Metamask).
2. Sube un archivo (PDF) que se guarda en **IPFS**.
3. El **hash del archivo** se registra en la blockchain mediante un **smart contract Solidity**.
4. Las empresas pueden visualizar los portfolios públicos y contactar a los usuarios directamente.

---

## Próximos pasos

* Mejorar la interfaz con frameworks modernos (React o Next.js).
* Integrar sistema de reputación o validación.
* Conectar con plataformas de empleo Web3.

---

## Equipo

Proyecto educativo desarrollado por estudiantes de ultimo año nivel secundario dentro del programa "Practicas profesionalizantes" - ETH-Kipu

---

**“Chamba on Chain ”**

