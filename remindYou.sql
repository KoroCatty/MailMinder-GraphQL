-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- ホスト: localhost:8889
-- 生成日時: 2023 年 10 月 07 日 14:05
-- サーバのバージョン： 5.7.34
-- PHP のバージョン: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `remindYou`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `Post`
--

CREATE TABLE `Post` (
  `id` int(11) NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `imgUrl` varchar(15000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  `userId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `Post`
--

INSERT INTO `Post` (`id`, `title`, `content`, `imgUrl`, `createdAt`, `updatedAt`, `userId`) VALUES
(1, 'UPLOADS', 'Uploads です', '/imgs/hero3.gif', '2023-10-01 02:26:44.579', '2023-10-01 02:26:44.579', 2),
(46, 'this is remote img', 'aaa', 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2ZsNTE5MzEwNjY2MjItaW1hZ2UuanBn.jpg', '2023-10-04 10:11:48.701', '2023-10-04 10:11:48.701', 3),
(63, 'afdasdfasdffafasf', 'lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem ', 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2ZsNTE5MzEwNjY2MjItaW1hZ2UuanBn.jpg', '2023-10-04 23:07:09.150', '2023-10-04 23:07:09.150', 2),
(65, 'hdf', 'fgh', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwISpfKHKPeS-GwywKwQSdG9_j9Gc7D7oO9Q&usqp=CAU', '2023-10-05 14:20:46.279', '2023-10-06 05:59:55.829', 2),
(67, 'test (Google が悪い)', 'test content', 'data:image/jpeg;base64,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', '2023-10-05 14:26:44.124', '2023-10-06 05:52:17.247', 2),
(68, 'fgh', 'fdsgsdf', 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2ZsNTE5MzEwNjY2MjItaW1hZ2UuanBn.jpg', '2023-10-05 14:27:18.848', '2023-10-05 14:27:18.848', 2),
(69, 'Uploads', 'te', '/imgs/noImg.jpeg', '2023-10-05 15:20:42.985', '2023-10-05 15:20:42.985', 2),
(71, 'Updated', 'dfaaafasdf', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOOkKu7wGRSSgbTvg6EInjHu4eo6N0tRkLwg&usqp=CAU', '2023-10-05 15:30:54.367', '2023-10-06 11:03:56.922', 2),
(72, 'NEKO', '猫ちゃんですよ', 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2ZsNTE5MzEwNjY2MjItaW1hZ2UuanBn.jpg', '2023-10-05 15:31:05.848', '2023-10-06 05:55:57.776', 2),
(74, 'new one', 'yay', 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL2ZsNTE5MzEwNjY2MjItaW1hZ2UuanBn.jpg', '2023-10-06 11:03:33.064', '2023-10-06 11:03:33.064', 2),
(75, 'Bite off more than you can chew', 'She wants to get them done quickly but she shouldn\'t bite off more than she can chew.', 'https://englishhelponline.files.wordpress.com/2010/04/gh.jpg', '2023-10-06 11:10:51.737', '2023-10-06 11:10:51.737', 2),
(76, 'Practice make perfect', 'Practice make perfectPractice make perfectPractice make perfectPractice make perfect', 'https://live.staticflickr.com/3393/3414888284_64a3ae6650_b.jpg', '2023-10-06 13:58:11.939', '2023-10-06 14:12:12.813', 2),
(77, 'no img (適当なパス入力)', 'no img desu', 'a', '2023-10-06 23:47:54.919', '2023-10-06 23:47:54.919', 3),
(78, 'bottle neck', 'This can be your bottle neck', 'https://itlever.files.wordpress.com/2010/09/bottleneck.jpg', '2023-10-07 00:11:27.110', '2023-10-07 00:11:27.110', 3),
(79, 'default img 2', 'default img 2', '/imgs/noImg.jpeg', '2023-10-07 09:45:55.780', '2023-10-07 10:36:17.844', 3),
(81, 'uplods default img', 'uplods default img text', '/imgs/noImg.jpeg', '2023-10-07 10:05:20.684', '2023-10-07 10:05:20.684', 3),
(82, 'デフォルト', 'darta', '/imgs/hero3.gif', '2023-10-07 11:31:24.066', '2023-10-07 11:31:24.066', 2);

-- --------------------------------------------------------

--
-- テーブルの構造 `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `User`
--

INSERT INTO `User` (`id`, `firstName`, `lastName`, `email`, `password`, `createdAt`) VALUES
(2, 'Kaz', 'kojima', 'drumer19861018@gmail.com', '$2a$10$nSrEfuStNE/vmu3awgyMbu6OcQ4faA2T1b8u.s8Np4ZB7Q/RlcfIu', '2023-09-30 09:11:54.353'),
(3, 'Koro', 'test', 'kojima.website@gmail.com', '$2a$10$Tw/NQu48ZOIR3QQO77VEEeSqZOyYpnhH9qP.WPxt8wJeIgCzwSuqm', '2023-09-30 23:41:01.205');

-- --------------------------------------------------------

--
-- テーブルの構造 `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- テーブルのデータのダンプ `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('691c904a-8058-49ab-80fb-7894c779b40b', '5c23d06f75a0ccfd701efef8a8d952aeab2b6178db2d259d367ebd83165a777e', '2023-09-30 07:19:17.441', '20230930071917_init', NULL, NULL, '2023-09-30 07:19:17.414', 1);

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Post_userId_fkey` (`userId`);

--
-- テーブルのインデックス `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- テーブルのインデックス `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルの AUTO_INCREMENT
--

--
-- テーブルの AUTO_INCREMENT `Post`
--
ALTER TABLE `Post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=83;

--
-- テーブルの AUTO_INCREMENT `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- ダンプしたテーブルの制約
--

--
-- テーブルの制約 `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `Post_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
