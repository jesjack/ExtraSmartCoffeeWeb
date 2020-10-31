SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `minecraft_access` (
  `id` int(11) NOT NULL,
  `user` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `alias` varchar(50) COLLATE utf8mb4_spanish_ci NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

ALTER TABLE `minecraft_access`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`user`),
  ADD KEY `alias` (`alias`);

ALTER TABLE `minecraft_access`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `minecraft_access`
  ADD CONSTRAINT `minecraft_access_ibfk_1` FOREIGN KEY (`alias`) REFERENCES `minecraft` (`alias`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `minecraft_access_ibfk_2` FOREIGN KEY (`user`) REFERENCES `user` (`user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;