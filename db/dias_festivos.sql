-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 26-04-2023 a las 10:39:14
-- Versión del servidor: 10.6.12-MariaDB-cll-lve
-- Versión de PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aizama_bdd_aizama`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dias_festivos`
--

CREATE TABLE `dias_festivos` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_spanish_ci NOT NULL,
  `fecha` varchar(10) NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Volcado de datos para la tabla `dias_festivos`
--

INSERT INTO `dias_festivos` (`id`, `descripcion`, `fecha`, `estado`) VALUES
(1, 'Año Nuevo  -  Fundación del Departamento de Cochabamba (año: 1954)', '01-01', 1),
(2, 'Fundación del Estado Plurinacional de Bolivia (año: 2010)', '01-22', 1),
(3, 'Fundación de Cobija (año: 1906)', '02-09', 1),
(4, 'Revolución de Oruro (año: 1781)', '02-10', 1),
(5, 'Invasión Chilena a Antofagasta (año: 1879)', '02-14', 1),
(6, 'Fundación de Santa Cruz (año: 1561)', '02-26', 1),
(7, 'Día internacional de la mujer (año: 1908)', '03-08', 1),
(8, 'Día del Padre, Carpintero y Trabajador en Radio y Televisión', '03-19', 1),
(9, 'Defensa de Calama - Día del Mar (año: 1879)', '03-23', 1),
(10, 'Fundación de Potosí (año: 1545)', '04-01', 1),
(11, 'Día del Niño Boliviano (año: 1945)', '04-12', 1),
(12, 'Día de las Américas (año: 1890)', '04-14', 1),
(13, 'Día Internacional del Trabajo (año: 1886)', '05-01', 1),
(14, 'Día Internacional de la Familia', '05-15', 1),
(15, 'Día de la Madre Boliviana – Las heroínas de la Coronilla', '05-27', 1),
(16, 'Día del Maestro Boliviano (año: 1909) -  Día Mundial del Medio Ambiente (año: 1972) ', '06-06', 1),
(17, 'Fundación de Tarija (año: 1574)', '07-04', 1),
(18, 'Día de la Amistad (año: 1869)', '07-23', 1),
(19, 'Fundación de la República de Bolivia (año: 1825)', '08-06', 1),
(20, 'Día de la Bandera Boliviana (año: 1825)', '08-17', 1),
(21, 'Día del Estudiante Boliviano (año: 1989)', '09-21', 1),
(22, 'Revolución de Santa Cruz (año: 1810)   -   Creación del departamento de Pando (año: 1938)', '09-24', 1),
(23, 'Día de la Mujer Boliviana (año: 1914)', '10-11', 1),
(24, 'Día de la raza – Descubrimiento de América (año: 1492)', '10-12', 1),
(25, 'Fundación de La Paz (año: 1548)', '10-20', 1),
(26, 'Fundación de Oruro (año: 1606)', '11-01', 1),
(27, 'Viernes Santo', '04-02', 1),
(28, 'Corpus Cristi', '06-23', 1),
(29, 'Año Nuevo Aymara  (año: 1880)', '06-21', 1),
(30, 'Festividad de Todos Santos - Día de los Difuntos', '11-02', 1),
(31, 'Navidad', '12-25', 1),
(32, 'Nacimiento de Antonio José de sucre (año: 1795)', '02-03', 1),
(33, 'Creación de la Ciudad de El Alto (año: 1985)', '03-06', 1),
(34, 'Día mundial del agua (año: 1993)', '03-22', 1),
(35, 'Día de la Trabajadora Boliviana del Hogar (año: 2006)', '03-30', 1),
(36, 'Día Mundial de la Salud (año: 1948)', '04-07', 1),
(37, 'Revolución de Tarija - Batalla de La Tablada (año: 1817)', '04-15', 1),
(38, 'Día Mundial de la tierra (año: 1970)', '04-22', 1),
(39, 'Día Internacional del Libro y Derechos de Autor (año: 1993)', '04-23', 1),
(40, 'Revolución de Chuquisaca (año: 1809)', '05-25', 1),
(41, 'Batalla del Alto de la Alianza (año: 1880)', '05-26', 1),
(42, 'San Juan', '06-24', 1),
(43, 'Revolución de La Paz (año: 1809)', '07-16', 1),
(44, 'Nacimiento de Simón Bolivar (año: 1783)', '07-24', 1),
(45, 'Día del Campesino Boliviano (año: 1937)', '08-02', 1),
(46, 'Día de las Fuerzas Armadas de Bolivia (año: 1825)', '08-07', 1),
(47, 'Día Internacional de la Alfabetización (año: 1967)', '09-08', 1),
(48, 'Revolición de Cochabamba (año: 1810)', '09-14', 1),
(49, 'Fundación de Chuquisaca (año: 1538)', '09-29', 1),
(50, 'Día del Árbol (año: 1992)', '10-01', 1),
(51, 'Día de las Naciones Unidas (año: 1945)', '10-24', 1),
(52, 'Día Nacional del Agua (año: 1989)', '10-29', 1),
(53, 'Revolución de Potosi (año: 1810)', '11-10', 1),
(54, 'Batalla de Ingavi (año: 1841)   -   Creación del Departamento del Beni (año: 1842)', '11-18', 1),
(55, 'Día Universal del Niño (año: 1959)', '11-20', 1),
(56, 'Día Internacional de los Derechos Humanos (año: 1948)', '12-10', 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `dias_festivos`
--
ALTER TABLE `dias_festivos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `dias_festivos`
--
ALTER TABLE `dias_festivos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
