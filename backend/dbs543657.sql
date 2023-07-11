-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-08-2021 a las 19:20:02
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.11

DROP DATABASE dbs543657a;
CREATE DATABASE dbs543657a;
USE dbs543657a;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "-02:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `dbs543657`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades`
--

CREATE TABLE `actividades` (
  `idactividad` int(12) NOT NULL,
  `nombre` varchar(24) NOT NULL,
  `descripcion` varchar(128) DEFAULT NULL,
  `fechaini` datetime NOT NULL,
  `fechafin` datetime NOT NULL,
  `color` varchar(7) NOT NULL,
  `idgrupo` varchar(10) NOT NULL,
  `dnimonitor` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alergias`
--

CREATE TABLE `alergias` (
  `idalergia` int(3) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(180) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `campus`
--

CREATE TABLE `campus` (
  `idcampus` varchar(6) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `direccion` varchar(120) DEFAULT NULL,
  `fechaini` date NOT NULL,
  `fechafin` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Tabla de información del campus';

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiares`
--

CREATE TABLE `familiares` (
  `tlf` int(9) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `apellidos` varchar(56) NOT NULL,
  `email` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupos`
--

CREATE TABLE `grupos` (
  `idgrupo` varchar(10) NOT NULL,
  `posicion` int(2) NOT NULL,
  `nombre` varchar(24) NOT NULL,
  `descripcion` varchar(128) DEFAULT NULL,
  `idcampus` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jornadas`
--

CREATE TABLE `jornadas` (
  `fecha` date NOT NULL DEFAULT current_timestamp(),
  `horaent` time DEFAULT NULL,
  `horasal` time DEFAULT NULL,
  `dnimonitor` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menus`
--

CREATE TABLE `menus` (
  `fecha` date NOT NULL,
  `idcampus` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `menu_tiene_plato`
--

CREATE TABLE `menu_tiene_plato` (
  `idcampus` varchar(6) NOT NULL,
  `fecha` date NOT NULL,
  `idplato` int(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `monitores`
--

CREATE TABLE `monitores` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `apellidos` varchar(56) NOT NULL,
  `telefono` int(9) NOT NULL,
  `email` varchar(128) NOT NULL,
  `especialidad` varchar(256) NOT NULL,
  `idcampus` varchar(6) NOT NULL,
  `idgrupo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `nominas`
--

CREATE TABLE `nominas` (
  `fechaini` date NOT NULL,
  `fechafin` date NOT NULL,
  `dnimonitor` varchar(9) NOT NULL,
  `pagada` varchar(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `fecha` date NOT NULL,
  `matricula` varchar(9) NOT NULL,
  `aulamat` tinyint(1) NOT NULL DEFAULT 0,
  `comedor` tinyint(1) NOT NULL DEFAULT 0,
  `postcom` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paselista`
--

CREATE TABLE `paselista` (
  `matricula` varchar(9) NOT NULL,
  `entrada` tinyint(1) NOT NULL DEFAULT 0,
  `aulamat` tinyint(1) NOT NULL DEFAULT 0,
  `comedor` tinyint(1) NOT NULL DEFAULT 0,
  `postcom` tinyint(1) NOT NULL DEFAULT 0,
  `salida` tinyint(1) NOT NULL DEFAULT 0,
  `tlffamiliar` varchar(9) DEFAULT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peques`
--

CREATE TABLE `peques` (
  `matricula` varchar(9) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `apellidos` varchar(56) NOT NULL,
  `fechanac` date NOT NULL,
  `pagada` tinyint(1) NOT NULL,
  `regalada` tinyint(1) NOT NULL,
  `idgrupo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peque_asiste_campus`
--

CREATE TABLE `peque_asiste_campus` (
  `matricula` varchar(9) NOT NULL,
  `idcampus` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peque_tiene_alergia`
--

CREATE TABLE `peque_tiene_alergia` (
  `matricula` varchar(9) NOT NULL,
  `idalergia` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peque_tiene_familiar`
--

CREATE TABLE `peque_tiene_familiar` (
  `matricula` varchar(9) NOT NULL,
  `tlffamiliar` int(9) NOT NULL,
  `tipofam` varchar(12) NOT NULL,
  `esprincipal` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peque_tiene_trastorno`
--

CREATE TABLE `peque_tiene_trastorno` (
  `matricula` varchar(9) NOT NULL,
  `idtrastorno` int(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platos`
--

CREATE TABLE `platos` (
  `idplato` int(12) NOT NULL,
  `nombre` varchar(24) NOT NULL,
  `tipo` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipofam`
--

CREATE TABLE `tipofam` (
  `tipo` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `tipofam`
--

INSERT INTO `tipofam` (`tipo`) VALUES
('madre'),
('padre'),
('abuela'),
('abuelo'),
('tio'),
('tia'),
('tutor'),
('otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `trastornos`
--

CREATE TABLE `trastornos` (
  `idtrastorno` int(3) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` varchar(180) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `user` varchar(12) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` varchar(12) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`user`, `password`, `level`) VALUES
('admin', '$2b$10$5UAUe51dHdEDLcVCz2fDROe3ZBt6efKcfD2K8zjahpRe/PhSoU9mS', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`idactividad`),
  ADD KEY `ACT_GRU_FK` (`idgrupo`),
  ADD KEY `ACT_MON_FK` (`dnimonitor`);

--
-- Indices de la tabla `alergias`
--
ALTER TABLE `alergias`
  ADD PRIMARY KEY (`idalergia`),
  ADD UNIQUE KEY `ALE_NOM_UK` (`nombre`);

--
-- Indices de la tabla `campus`
--
ALTER TABLE `campus`
  ADD PRIMARY KEY (`idcampus`),
  ADD UNIQUE KEY `CAM_NOM_UK` (`nombre`);

--
-- Indices de la tabla `familiares`
--
ALTER TABLE `familiares`
  ADD PRIMARY KEY (`tlf`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD PRIMARY KEY (`idgrupo`),
  ADD KEY `GRU_IDC_FK` (`idcampus`);

--
-- Indices de la tabla `jornadas`
--
ALTER TABLE `jornadas`
  ADD PRIMARY KEY (`fecha`,`dnimonitor`),
  ADD KEY `JOR_MON_FK` (`dnimonitor`);

--
-- Indices de la tabla `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`fecha`,`idcampus`),
  ADD KEY `MEN_IDC_FK` (`idcampus`);

--
-- Indices de la tabla `menu_tiene_plato`
--
ALTER TABLE `menu_tiene_plato`
  ADD PRIMARY KEY (`idcampus`,`fecha`,`idplato`),
  ADD KEY `MTP_PLA_FK` (`idplato`);

--
-- Indices de la tabla `monitores`
--
ALTER TABLE `monitores`
  ADD PRIMARY KEY (`dni`),
  ADD KEY `MON_GRU_FK` (`idgrupo`),
  ADD KEY `MON_CAM_FK` (`idcampus`);

--
-- Indices de la tabla `nominas`
--
ALTER TABLE `nominas`
  ADD PRIMARY KEY (`fechaini`,`fechafin`,`dnimonitor`),
  ADD KEY `NOM_MON_FK` (`dnimonitor`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`fecha`,`matricula`),
  ADD KEY `PAG_PEQ_FK` (`matricula`);

--
-- Indices de la tabla `paselista`
--
ALTER TABLE `paselista`
  ADD PRIMARY KEY (`matricula`,`fecha`),
  ADD KEY `PAS_MAT_FK` (`matricula`),
  ADD KEY `PAS_TLF_FK` (`tlffamiliar`);

--
-- Indices de la tabla `peques`
--
ALTER TABLE `peques`
  ADD PRIMARY KEY (`matricula`),
  ADD KEY `PEQ_GRU_FK` (`idgrupo`);

--
-- Indices de la tabla `peque_asiste_campus`
--
ALTER TABLE `peque_asiste_campus`
  ADD PRIMARY KEY (`matricula`,`idcampus`),
  ADD KEY `PAC_PEQ_FK` (`matricula`),
  ADD KEY `PAC_CAM_FK` (`idcampus`);

--
-- Indices de la tabla `peque_tiene_alergia`
--
ALTER TABLE `peque_tiene_alergia`
  ADD PRIMARY KEY (`matricula`,`idalergia`),
  ADD KEY `PTA_ALE_FK` (`idalergia`),
  ADD KEY `PTA_PEQ_FK` (`matricula`);

--
-- Indices de la tabla `peque_tiene_familiar`
--
ALTER TABLE `peque_tiene_familiar`
  ADD PRIMARY KEY (`matricula`,`tlffamiliar`),
  ADD KEY `PTF_FAM_FK` (`tlffamiliar`),
  ADD KEY `PTF_PEQ_FK` (`matricula`);

--
-- Indices de la tabla `peque_tiene_trastorno`
--
ALTER TABLE `peque_tiene_trastorno`
  ADD PRIMARY KEY (`matricula`,`idtrastorno`),
  ADD KEY `PTT_ALE_FK` (`idtrastorno`) USING BTREE,
  ADD KEY `PTT_PEQ_FK` (`matricula`) USING BTREE;

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`idplato`);

--
-- Indices de la tabla `trastornos`
--
ALTER TABLE `trastornos`
  ADD PRIMARY KEY (`idtrastorno`) USING BTREE,
  ADD UNIQUE KEY `TRA_NOM_UK` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`user`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `actividades`
--
ALTER TABLE `actividades`
  MODIFY `idactividad` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT de la tabla `alergias`
--
ALTER TABLE `alergias`
  MODIFY `idalergia` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90119;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `idplato` int(12) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `trastornos`
--
ALTER TABLE `trastornos`
  MODIFY `idtrastorno` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `ACT_GRU_FK` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`),
  ADD CONSTRAINT `ACT_MON_FK` FOREIGN KEY (`dnimonitor`) REFERENCES `monitores` (`dni`);

--
-- Filtros para la tabla `grupos`
--
ALTER TABLE `grupos`
  ADD CONSTRAINT `GRU_IDC_FK` FOREIGN KEY (`idcampus`) REFERENCES `campus` (`idcampus`);

--
-- Filtros para la tabla `menus`
--
ALTER TABLE `menus`
  ADD CONSTRAINT `MEN_IDC_FK` FOREIGN KEY (`idcampus`) REFERENCES `campus` (`idcampus`);

--
-- Filtros para la tabla `menu_tiene_plato`
--
ALTER TABLE `menu_tiene_plato`
  ADD CONSTRAINT `MTP_MEN_FK` FOREIGN KEY (`idcampus`,`fecha`) REFERENCES `menus` (`idcampus`, `fecha`),
  ADD CONSTRAINT `MTP_PLA_FK` FOREIGN KEY (`idplato`) REFERENCES `platos` (`idplato`);

--
-- Filtros para la tabla `monitores`
--
ALTER TABLE `monitores`
  ADD CONSTRAINT `MON_CAM_FK` FOREIGN KEY (`idcampus`) REFERENCES `campus` (`idcampus`),
  ADD CONSTRAINT `MON_GRU_FK` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`);

--
-- Filtros para la tabla `nominas`
--
ALTER TABLE `nominas`
  ADD CONSTRAINT `NOM_MON_FK` FOREIGN KEY (`dnimonitor`) REFERENCES `monitores` (`dni`);

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `PAG_PEQ_FK` FOREIGN KEY (`matricula`) REFERENCES `peques` (`matricula`);

--
-- Filtros para la tabla `peques`
--
ALTER TABLE `peques`
  ADD CONSTRAINT `PEQ_GRU_FK` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`);

--
-- Filtros para la tabla `peque_tiene_alergia`
--
ALTER TABLE `peque_tiene_alergia`
  ADD CONSTRAINT `PTA_ALE_FK` FOREIGN KEY (`idalergia`) REFERENCES `alergias` (`idalergia`),
  ADD CONSTRAINT `PTA_PEQ_FK` FOREIGN KEY (`matricula`) REFERENCES `peques` (`matricula`);

--
-- Filtros para la tabla `peque_tiene_familiar`
--
ALTER TABLE `peque_tiene_familiar`
  ADD CONSTRAINT `PTF_FAM_FK` FOREIGN KEY (`tlffamiliar`) REFERENCES `familiares` (`tlf`),
  ADD CONSTRAINT `PTF_PEQ_FK` FOREIGN KEY (`matricula`) REFERENCES `peques` (`matricula`);

--
-- Filtros para la tabla `peque_tiene_trastorno`
--
ALTER TABLE `peque_tiene_trastorno`
  ADD CONSTRAINT `PTT_PEQ_FK` FOREIGN KEY (`matricula`) REFERENCES `peques` (`matricula`),
  ADD CONSTRAINT `PTT_TRA_FK` FOREIGN KEY (`idtrastorno`) REFERENCES `trastornos` (`idtrastorno`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
