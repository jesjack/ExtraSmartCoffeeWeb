SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";CREATE TABLE `minecraft` (
  `alias` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `host` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `port` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `path` text COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;ALTER TABLE `minecraft`
  ADD PRIMARY KEY (`alias`);
COMMIT;