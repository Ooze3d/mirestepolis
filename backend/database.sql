-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-05-2021 a las 19:19:47
-- Versión del servidor: 10.4.14-MariaDB
-- Versión de PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


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
  `fecha_ini` datetime NOT NULL,
  `fecha_fin` datetime NOT NULL,
  `color` varchar(7) NOT NULL,
  `idGrupo` varchar(10) NOT NULL,
  `dnimonitor` varchar(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `actividades`
--

INSERT INTO `actividades` (`idactividad`, `nombre`, `descripcion`, `fecha_ini`, `fecha_fin`, `color`, `idGrupo`, `dnimonitor`) VALUES
(44, 'Futbol', 'Futbol', '2021-05-24 10:00:00', '2021-05-24 11:00:00', '#FFADAD', 'mir678_gr1', '45659853T'),
(45, 'Baloncesto', 'Baloncesto', '2021-05-24 09:00:00', '2021-05-24 10:00:00', '#FFD6A5', 'mir678_gr1', '45659853T'),
(46, 'Balon', 'Balon', '2021-05-24 09:30:00', '2021-05-24 10:30:00', '#CAFFBF', 'mir678_inf', '45659853T'),
(47, 'Balin', 'Balin', '2021-05-24 10:30:00', '2021-05-24 11:00:00', '#9BF6FF', 'mir678_inf', '45659853T');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alergias`
--

CREATE TABLE `alergias` (
  `idalergia` varchar(6) NOT NULL,
  `nombre` varchar(40) NOT NULL,
  `descripcion` int(180) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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

--
-- Volcado de datos para la tabla `campus`
--

INSERT INTO `campus` (`idcampus`, `nombre`, `direccion`, `fechaini`, `fechafin`) VALUES
('mir678', 'Mirestépolis', 'Club Mireste s/n', '2021-05-02', '2021-05-31'),
('par721', 'Parque Verde', 'Otra Dirección', '2021-05-02', '2021-05-31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `familiares`
--

CREATE TABLE `familiares` (
  `dni` varchar(9) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `apellidos` varchar(56) NOT NULL,
  `telefono` int(9) NOT NULL,
  `email` varchar(128) NOT NULL,
  `tipofam` varchar(12) NOT NULL
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

--
-- Volcado de datos para la tabla `grupos`
--

INSERT INTO `grupos` (`idgrupo`, `posicion`, `nombre`, `descripcion`, `idcampus`) VALUES
('mir678_gr1', 2, 'Grupo 1 (6-7-8)', 'Grupo 1 (6-7-8) del campus mir678', 'mir678'),
('mir678_gr2', 3, 'Grupo 2 (9-10)', 'Grupo 2 (9-10) del campus mir678', 'mir678'),
('mir678_gr3', 4, 'Grupo 3 (11-12-13)', 'Grupo 3 (11-12-13) del campus mir678', 'mir678'),
('mir678_inf', 1, 'Infantil (3-4-5-6)', 'Infantil (3-4-5-6) del campus mir678', 'mir678'),
('par721_gr1', 2, 'Grupo 1 (6-7-8)', 'Grupo 1 (6-7-8) del campus par721', 'par721'),
('par721_gr2', 3, 'Grupo 2 (9-10)', 'Grupo 2 (9-10) del campus par721', 'par721'),
('par721_gr3', 4, 'Grupo 3 (11-12-13)', 'Grupo 3 (11-12-13) del campus par721', 'par721'),
('par721_inf', 1, 'Infantil (3-4-5-6)', 'Infantil (3-4-5-6) del campus par721', 'par721');

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

--
-- Volcado de datos para la tabla `jornadas`
--

INSERT INTO `jornadas` (`fecha`, `horaent`, `horasal`, `dnimonitor`) VALUES
('2021-04-01', '09:00:00', '12:00:00', '45659853T'),
('2021-04-08', '08:00:00', '12:00:00', '45659853T'),
('2021-05-05', '08:00:00', '12:00:00', '45659853T'),
('2021-05-07', '10:00:00', '12:00:00', '45659853T'),
('2021-05-20', '08:00:00', '13:00:00', '45659853T'),
('2021-05-21', '08:00:00', '12:00:00', '45659853T'),
('2021-06-17', '09:00:00', '12:00:00', '45659853T'),
('2021-07-08', '09:00:00', '12:00:00', '45659853T');

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

--
-- Volcado de datos para la tabla `monitores`
--

INSERT INTO `monitores` (`dni`, `nombre`, `apellidos`, `telefono`, `email`, `especialidad`, `idcampus`, `idgrupo`) VALUES
('45659853T', 'Jose Antonio', 'Garcia Lopez', 661272382, 'Ooze3d@gmail.com', 'Informatica', 'mir678', 'mir678_gr2');

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
  `matriculapeque` varchar(9) NOT NULL,
  `tipo` varchar(16) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peques`
--

CREATE TABLE `peques` (
  `matricula` varchar(9) NOT NULL,
  `nombre` varchar(32) NOT NULL,
  `apellidos` varchar(56) NOT NULL,
  `fechanac` date NOT NULL,
  `aulamat` tinyint(1) NOT NULL,
  `comedor` tinyint(1) NOT NULL,
  `postcom` tinyint(1) NOT NULL,
  `idgrupo` varchar(10) NOT NULL,
  `idcampus` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peque_tiene_alergia`
--

CREATE TABLE `peque_tiene_alergia` (
  `matriculapeque` varchar(9) NOT NULL,
  `idalergia` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `peque_tiene_familiar`
--

CREATE TABLE `peque_tiene_familiar` (
  `matriculapeque` varchar(9) NOT NULL,
  `dnifamiliar` varchar(9) NOT NULL,
  `esprincipal` tinyint(1) NOT NULL
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
('admin', '$2b$10$5UAUe51dHdEDLcVCz2fDROe3ZBt6efKcfD2K8zjahpRe/PhSoU9mS', 'admin'),
('theboss', '$2b$10$9uk6kPdG.AikuUK1/yMmhOmZhRH0CHUdxXND7q/WswOGerwdr9rFa', 'admin');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD PRIMARY KEY (`idactividad`),
  ADD KEY `ACT_GRU_FK` (`idGrupo`),
  ADD KEY `ACT_MON_FK` (`dnimonitor`);

--
-- Indices de la tabla `alergias`
--
ALTER TABLE `alergias`
  ADD PRIMARY KEY (`idalergia`);

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
  ADD PRIMARY KEY (`dni`),
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
  ADD PRIMARY KEY (`fecha`,`dnimonitor`);

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
  ADD PRIMARY KEY (`fecha`,`matriculapeque`);

--
-- Indices de la tabla `peques`
--
ALTER TABLE `peques`
  ADD PRIMARY KEY (`matricula`),
  ADD KEY `PEQ_GRU_FK` (`idgrupo`),
  ADD KEY `PEQ_CAM_FK` (`idcampus`);

--
-- Indices de la tabla `peque_tiene_alergia`
--
ALTER TABLE `peque_tiene_alergia`
  ADD PRIMARY KEY (`matriculapeque`,`idalergia`),
  ADD KEY `PTA_ALE_FK` (`idalergia`);

--
-- Indices de la tabla `peque_tiene_familiar`
--
ALTER TABLE `peque_tiene_familiar`
  ADD PRIMARY KEY (`matriculapeque`,`dnifamiliar`),
  ADD KEY `PTF_FAM_FK` (`dnifamiliar`);

--
-- Indices de la tabla `platos`
--
ALTER TABLE `platos`
  ADD PRIMARY KEY (`idplato`);

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
  MODIFY `idactividad` int(12) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `platos`
--
ALTER TABLE `platos`
  MODIFY `idplato` int(12) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `actividades`
--
ALTER TABLE `actividades`
  ADD CONSTRAINT `ACT_GRU_FK` FOREIGN KEY (`idGrupo`) REFERENCES `grupos` (`idgrupo`),
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
-- Filtros para la tabla `peques`
--
ALTER TABLE `peques`
  ADD CONSTRAINT `PEQ_CAM_FK` FOREIGN KEY (`idcampus`) REFERENCES `campus` (`idcampus`),
  ADD CONSTRAINT `PEQ_GRU_FK` FOREIGN KEY (`idgrupo`) REFERENCES `grupos` (`idgrupo`);

--
-- Filtros para la tabla `peque_tiene_alergia`
--
ALTER TABLE `peque_tiene_alergia`
  ADD CONSTRAINT `PTA_ALE_FK` FOREIGN KEY (`idalergia`) REFERENCES `alergias` (`idalergia`),
  ADD CONSTRAINT `PTA_PEQ_FK` FOREIGN KEY (`matriculapeque`) REFERENCES `peques` (`matricula`);

--
-- Filtros para la tabla `peque_tiene_familiar`
--
ALTER TABLE `peque_tiene_familiar`
  ADD CONSTRAINT `PTF_FAM_FK` FOREIGN KEY (`dnifamiliar`) REFERENCES `familiares` (`dni`),
  ADD CONSTRAINT `PTF_PEQ_FK` FOREIGN KEY (`matriculapeque`) REFERENCES `peques` (`matricula`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
