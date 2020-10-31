SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
CREATE TABLE `user` (
  `user` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `email` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `password` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`data`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;
ALTER TABLE `user`
  ADD PRIMARY KEY (`user`),
  ADD UNIQUE KEY `email` (`email`);
COMMIT;