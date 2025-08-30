-- Create requirements table for storing student document uploads
CREATE TABLE IF NOT EXISTS `requirements` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `studentId` int(11) unsigned NOT NULL,
  `requirementType` enum('psa','validId','form137','idPicture') NOT NULL,
  `fileName` varchar(255) NOT NULL,
  `filePath` varchar(500) NOT NULL,
  `fileSize` int(11) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
  `isSubmitted` tinyint(1) NOT NULL DEFAULT 0,
  `submittedAt` datetime DEFAULT NULL,
  `verifiedBy` int(11) unsigned DEFAULT NULL,
  `verifiedAt` datetime DEFAULT NULL,
  `status` enum('pending','submitted','verified','rejected') NOT NULL DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_student_requirement` (`studentId`,`requirementType`),
  KEY `idx_studentId` (`studentId`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_requirements_student` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_requirements_verifier` FOREIGN KEY (`verifiedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
