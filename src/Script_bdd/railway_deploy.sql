-- MySQL Script modified for Railway deployment
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

USE `railway`;

-- -----------------------------------------------------
-- Table `railway`.`Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Cliente` (
  `id_Cliente_documento` VARCHAR(20) NOT NULL,
  `numero_identidad` VARCHAR(20) NULL,
  `nombres` VARCHAR(150) NULL,
  `apellidos` VARCHAR(150) NULL,
  `telefono` VARCHAR(20) NULL,
  `correoElectronico` VARCHAR(250) NULL,
  PRIMARY KEY (`id_Cliente_documento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Continúa con el resto de las tablas reemplazando 'sae_software' por 'railway'