-- phpMyAdmin SQL Dump
-- version 4.5.1
-- http://www.phpmyadmin.net
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-01-2024 a las 20:52:08
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

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `p2` ()  BEGIN
DECLARE uid varchar(3);
DECLARE cad varchar(5);
DECLARE done BOOLEAN DEFAULT FALSE;
DECLARE sql1 CURSOR for select codprof from profe WHERE estado='activo';
DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = TRUE;
OPEN sql1;
c1_loop: LOOP
fetch sql1 into uid;
IF `done` THEN LEAVE c1_loop; END IF;
SET cad='%'+uid+'%';
SELECT @reg:=nromsg FROM chat where c_envia LIKE cad;
END LOOP c1_loop;
CLOSE sql1;
END$$

--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `insertar_evaluacion_alumno` (`codalu` INT, `codeva` INT, `fechaini` VARCHAR(20), `fechafin` VARCHAR(20), `notafinal` INT, `proceso` INT(1), `estado` INT(1)) RETURNS INT(11) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO em_alumno(codalu,codeva,fechaini,fechafin,notafinal,proceso,estado) VALUES(codalu,codeva,fechaini,fechafin,notafinal,proceso,estado);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertar_pregunta` (`codeva` INT, `nro` INT, `pregunta` VARCHAR(500), `fecha` VARCHAR(20), `codprof` VARCHAR(20), `estado` INT(1)) RETURNS INT(7) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO pregunta_eval_escrito(codeva,nro,pregunta,fecha,codprof,estado) VALUES(codeva,nro,pregunta,fecha,codprof,estado);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertar_pregunta_mixta` (`em_p_evaluacion` INT, `em_p_pregunta` VARCHAR(500), `em_p_nota` INT(3), `em_p_tipo` INT(2), `em_p_fechaReg` VARCHAR(20), `em_p_codprof` VARCHAR(20), `em_p_estado` INT(1)) RETURNS INT(11) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO em_preguntas(em_p_evaluacion,em_p_pregunta,em_p_nota,em_p_tipo,em_p_fechaReg,em_p_codprof,em_p_estado) VALUES(em_p_evaluacion,em_p_pregunta,em_p_nota,em_p_tipo,em_p_fechaReg,em_p_codprof,em_p_estado);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertcontrolchat` (`idmsg` INT(8), `receptor` VARCHAR(7)) RETURNS INT(8) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO control_envio_de_mensajes(idmsg,receptor,estado) VALUES(idmsg,receptor,0);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertmsg` (`est` INT, `msg` LONGTEXT, `em` VARCHAR(50), `usr` VARCHAR(7), `tipo` INT, `tut` INT(7), `fec` DATE, `ho` TIME, `tip` INT(1)) RETURNS INT(7) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO msg_pend(cod_est,mensaje,emisor,codusr,tipousr,cod_tutor,fecha,hora,estado,tipo) VALUES(est,msg,em,usr,tipo,tut,fec,ho,0,tip);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertmsgchat` (`emit` VARCHAR(3), `nombre` VARCHAR(50), `msg` VARCHAR(200), `fecha` DATE, `hora` TIME, `tipo` INT(1), `tipoemit` INT(1)) RETURNS INT(7) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO mensaje_chat(emit,nombre,mensaje,fecha,hora,tipo,tipoemit) VALUES(emit,nombre,msg,fecha,hora,tipo,tipoemit);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertpracticoadj` (`trimestre` INT, `gestion` INT, `codcur` INT, `codpar` INT, `codmat` VARCHAR(3), `descripcion` VARCHAR(200), `codprof` VARCHAR(4), `fecha` VARCHAR(10), `hora` TIME, `fechaReg` VARCHAR(20), `estado` INT(1), `nota` INT(3)) RETURNS INT(7) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO cuestionarios(gestion,bimestre,cod_cur,cod_par,codprof,cod_mat,descrip,fecha,hora,fechaReg,estado,nota) VALUES(gestion,trimestre,codcur,codpar,codprof,codmat,descripcion,fecha,hora,fechaReg,estado,nota);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `insertpracticoweb` (`gestion` INT, `trimestre` INT, `codcur` INT, `codpar` INT, `codmat` VARCHAR(3), `descripcion` VARCHAR(200), `codprof` VARCHAR(4), `fecha` VARCHAR(10), `hora` TIME, `estado` INT(1), `fechaReg` VARCHAR(20), `nota` INT(3)) RETURNS INT(11) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO practicos_web(gestion,trimestre,codcur,codpar,codmat,descripcion,codprof,fecha,hora,fechaReg,editable,estado,nota) VALUES(gestion,trimestre,codcur,codpar,codmat,descripcion,codprof,fecha,hora,fechaReg,1,estado,nota);
set cant = LAST_INSERT_ID();
RETURN cant;
END$$

CREATE DEFINER=`root`@`localhost` FUNCTION `save_evento` (`des` VARCHAR(500), `fech` VARCHAR(10), `ini` VARCHAR(8), `fin` VARCHAR(8), `fecR` VARCHAR(19), `adm` INT(3)) RETURNS INT(11) BEGIN
DECLARE cant int DEFAULT 0;
INSERT INTO eventos(descripcion,fecha,horai,horaf,fechareg,admin,estado) VALUES(des,fech,ini,fin,fecR,adm,1);
set cant = LAST_INSERT_ID();
return cant;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_inicial`
--

CREATE TABLE `evaluacion_inicial` (
  `id` int(11) NOT NULL,
  `gestion` int(4) NOT NULL,
  `trimestre` int(1) NOT NULL,
  `codcur` int(3) NOT NULL,
  `codpar` int(5) NOT NULL,
  `codmat` varchar(3) COLLATE utf8_unicode_ci NOT NULL,
  `descripcion` varchar(500) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `visible` int(1) NOT NULL,
  `inicio` datetime NOT NULL,
  `fin` datetime NOT NULL,
  `fueradetiempo` int(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `evaluacion_inicial`
--

INSERT INTO `evaluacion_inicial` (`id`, `gestion`, `trimestre`, `codcur`, `codpar`, `codmat`, `descripcion`, `visible`, `inicio`, `fin`, `fueradetiempo`, `createdAt`, `updateAt`, `estado`) VALUES
(1, 2024, 1, 4, 1, 'I1', 'Primer Evaluación para nivel inicial editado', 0, '2024-01-11 09:00:00', '2024-01-11 13:00:00', 0, '2024-01-11 00:00:00', '2024-01-16 15:30:58', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_inicial_actividad`
--

CREATE TABLE `evaluacion_inicial_actividad` (
  `id` int(11) NOT NULL,
  `id_evaluacion_inicial` int(11) NOT NULL,
  `id_actividad_evaluacion_inicial` int(11) NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `evaluacion_inicial_actividad`
--

INSERT INTO `evaluacion_inicial_actividad` (`id`, `id_evaluacion_inicial`, `id_actividad_evaluacion_inicial`, `estado`) VALUES
(1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_inicial_actividades`
--

CREATE TABLE `evaluacion_inicial_actividades` (
  `id` int(11) NOT NULL,
  `descripcion` varchar(500) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `script` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `captura` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `evaluacion_inicial_actividades`
--

INSERT INTO `evaluacion_inicial_actividades` (`id`, `descripcion`, `script`, `captura`, `estado`) VALUES
(1, 'Encerramos con un círculo los materiales de aseo personal y los que no son tachamos con una X', 'evaluacion_1.php', 'actividad1.png', 1),
(2, 'Observa y luego identifica las actividades que se realizan en el día y en la noche, muévelas al lugar que corresponden', 'evaluacion_2.php', 'actividad2.png', 1),
(3, '¿Qué quieres ser cuando seas grande? Coloca una imagen en el centro de la flor. Pinta la flor también', 'evaluacion_3.php', 'actividad3.png', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_inicial_actividad_alumno`
--

CREATE TABLE `evaluacion_inicial_actividad_alumno` (
  `id` int(11) NOT NULL,
  `codalu` int(11) NOT NULL,
  `id_evaluacion_alumno` int(11) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `captura` longtext NOT NULL,
  `ordenadas` longtext NOT NULL,
  `observacion` varchar(500) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_inicial_actividad_programada`
--

CREATE TABLE `evaluacion_inicial_actividad_programada` (
  `id` int(11) NOT NULL,
  `gestion` int(4) NOT NULL,
  `trimestre` int(1) NOT NULL,
  `codcur` int(5) NOT NULL,
  `codpar` int(3) NOT NULL,
  `id_actividad` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `estado` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluacion_inicial_alumno`
--

CREATE TABLE `evaluacion_inicial_alumno` (
  `id` int(11) NOT NULL,
  `codalu` int(5) NOT NULL,
  `id_evaluacion` int(11) NOT NULL,
  `calificacion` varchar(200) CHARACTER SET utf8 COLLATE utf8_spanish_ci NOT NULL,
  `estado` int(1) NOT NULL,
  `proceso` int(1) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updateAt` datetime NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `evaluacion_inicial`
--
ALTER TABLE `evaluacion_inicial`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluacion_inicial_actividad`
--
ALTER TABLE `evaluacion_inicial_actividad`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluacion_inicial_actividades`
--
ALTER TABLE `evaluacion_inicial_actividades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluacion_inicial_actividad_alumno`
--
ALTER TABLE `evaluacion_inicial_actividad_alumno`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluacion_inicial_actividad_programada`
--
ALTER TABLE `evaluacion_inicial_actividad_programada`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `evaluacion_inicial_alumno`
--
ALTER TABLE `evaluacion_inicial_alumno`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `evaluacion_inicial`
--
ALTER TABLE `evaluacion_inicial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `evaluacion_inicial_actividad`
--
ALTER TABLE `evaluacion_inicial_actividad`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `evaluacion_inicial_actividades`
--
ALTER TABLE `evaluacion_inicial_actividades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `evaluacion_inicial_actividad_alumno`
--
ALTER TABLE `evaluacion_inicial_actividad_alumno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `evaluacion_inicial_actividad_programada`
--
ALTER TABLE `evaluacion_inicial_actividad_programada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `evaluacion_inicial_alumno`
--
ALTER TABLE `evaluacion_inicial_alumno`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
