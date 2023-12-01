-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2023 a las 20:53:09
-- Versión del servidor: 10.1.13-MariaDB
-- Versión de PHP: 5.6.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aizama_bdd_2023`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluaciones_inicial`
--

CREATE TABLE `evaluaciones_inicial` (
  `id` int(11) NOT NULL,
  `gestion` int(4) NOT NULL,
  `trimestre` int(1) NOT NULL,
  `codalu` int(5) NOT NULL,
  `evaluacion` int(2) NOT NULL,
  `imagen` longtext COLLATE utf8_unicode_ci NOT NULL,
  `estado` int(1) NOT NULL,
  `fecha` datetime NOT NULL,
  `calificacion` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `evaluaciones_inicial`
--
ALTER TABLE `evaluaciones_inicial`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evaluaciones_inicial`
--
ALTER TABLE `evaluaciones_inicial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
