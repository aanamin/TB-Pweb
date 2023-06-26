-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2023 at 10:21 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `siletra`
--

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

CREATE TABLE `documents` (
  `id` varchar(7) NOT NULL,
  `id_user` varchar(7) NOT NULL,
  `name` varchar(50) NOT NULL,
  `filename` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `id_user`, `name`, `filename`, `description`, `created_at`, `updated_at`) VALUES
('doc1', 'user1', 'kartu uas amin', 'kartu_uas.pdf', 'harap ditandatangani', '2023-06-17 17:00:00', '2023-06-17 17:00:00'),
('doc3', 'user2', 'Pos', 'tugas.pdf', 'artikel', '2023-06-17 17:00:00', '2023-06-17 17:00:00'),
('doc4', 'user1', 'Laporan', 'Laporan_Keuangan.pdf', 'laporan keuangan kegiatan fti mengajar', '2023-06-19 17:00:00', '2023-06-19 17:00:00'),
('doc4ser', 'user1', 'sertifikat_lea', 'sertifikat.pdf', 'sertifikat workshop lea x hmsi', '2023-06-23 17:00:00', '2023-06-23 17:00:00'),
('doc6', 'user3', 'artikel damin', 'artikel_data_mining.pdf', 'artikel data mining', '2023-06-24 17:00:00', '2023-06-24 17:00:00'),
('doc6soa', 'user1', 'soal damin', 'soal_Datamining.pdf', 'soal uas data mining', '2023-06-24 17:00:00', '2023-06-24 17:00:00'),
('doc7', 'user1', 'file contoh', 'file_contoh.pdf', 'file contoh untuk halo', '2023-06-24 17:00:00', '2023-06-24 17:00:00'),
('doc8', 'user1', 'file', 'file.pdf', 'file', '2023-06-24 17:00:00', '2023-06-24 17:00:00'),
('doc9', 'user2', 'tugas', 'tugasuser2.pdf', 'tugas', '2023-06-24 17:00:00', '2023-06-24 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `signature`
--

CREATE TABLE `signature` (
  `user_id` varchar(7) NOT NULL,
  `document_id` varchar(7) NOT NULL,
  `id_tujuan` varchar(7) NOT NULL,
  `jabatan` varchar(50) NOT NULL,
  `status` varchar(30) DEFAULT NULL,
  `signed_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `signature`
--

INSERT INTO `signature` (`user_id`, `document_id`, `id_tujuan`, `jabatan`, `status`, `signed_at`, `created_at`, `updated_at`) VALUES
('user1', 'doc1', 'user2', 'Dosen Pa', 'accept', NULL, '2023-06-19 17:00:00', '2023-06-22 17:00:00'),
('user1', 'doc4', 'user2', 'Bendahara', 'accept', NULL, '2023-06-19 17:00:00', '2023-06-21 17:00:00'),
('user1', 'doc4ser', 'user2', 'Dosen lea', 'accept', '2023-06-24 17:00:00', '2023-06-24 17:00:00', '2023-06-24 17:00:00'),
('user1', 'doc6soa', 'user2', 'komp', 'accept', '2023-06-24 17:00:00', '2023-06-24 17:00:00', '2023-06-24 17:00:00'),
('user1', 'doc7', 'user3', 'dosen pengawas', 'accept', '2023-06-25 17:00:00', '2023-06-25 17:00:00', '2023-06-25 17:00:00'),
('user1', 'doc8', 'user2', 'kadin', 'accept', '2023-06-25 17:00:00', '2023-06-25 17:00:00', '2023-06-25 17:00:00'),
('user2', 'doc3', 'user1', 'sekretaris', 'accept', NULL, '2023-06-18 17:00:00', '2023-06-21 17:00:00'),
('user2', 'doc9', 'user1', 'dosen pengampu', 'accept', '2023-06-25 17:00:00', '2023-06-25 17:00:00', '2023-06-25 17:00:00'),
('user3', 'doc6', 'user1', 'dosen pengampu', 'accept', '2023-06-25 17:00:00', '2023-06-25 17:00:00', '2023-06-25 17:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(7) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `active` int(7) NOT NULL DEFAULT 0,
  `sign_img` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `password`, `active`, `sign_img`, `created_at`, `updated_at`) VALUES
('user1', 'admin', 'admin@gmail.com', 'admin123', 1, 'user1.png', '2023-06-17 17:00:00', '2023-06-25 17:00:00'),
('user2', 'user', 'user@gmail.com', 'user', 0, 'user2.png', '2023-06-17 17:00:00', '2023-06-21 17:00:00'),
('user3', '123halo', '123@gmail.com', 'admin', 0, 'user3.png', '2023-06-24 17:00:00', '2023-06-24 17:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `documents`
--
ALTER TABLE `documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_user` (`id_user`) USING BTREE;

--
-- Indexes for table `signature`
--
ALTER TABLE `signature`
  ADD PRIMARY KEY (`user_id`,`document_id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`document_id`),
  ADD KEY `id_tujuan` (`id_tujuan`),
  ADD KEY `document_id` (`document_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `signature`
--
ALTER TABLE `signature`
  ADD CONSTRAINT `signature_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `signature_ibfk_3` FOREIGN KEY (`id_tujuan`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `signature_ibfk_4` FOREIGN KEY (`document_id`) REFERENCES `documents` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
