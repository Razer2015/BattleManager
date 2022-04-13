-- New table
CREATE TABLE `battlemanager_roles` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'latin1_swedish_ci',
	`description` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `unique` (`name`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1;

-- Currently supported roles
INSERT INTO `battlemanager_roles` (`id`, `name`, `description`) VALUES (1, 'super', 'The admin of all admins');
INSERT INTO `battlemanager_roles` (`id`, `name`, `description`) VALUES (2, 'admin', 'Just a normal admin');
INSERT INTO `battlemanager_roles` (`id`, `name`, `description`) VALUES (3, 'user', 'Normal user with pretty much just read access');

-- New table
CREATE TABLE `battlemanager_userroles` (
	`roleId` INT(11) NOT NULL,
	`userId` INT(11) NOT NULL,
	PRIMARY KEY (`roleId`, `userId`) USING BTREE,
	INDEX `FK_userrole_user` (`userId`) USING BTREE,
	CONSTRAINT `FK_userrole_role` FOREIGN KEY (`roleId`) REFERENCES `battlemanager_roles` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE,
	CONSTRAINT `FK_userrole_user` FOREIGN KEY (`userId`) REFERENCES `battlemanager_users` (`id`) ON UPDATE NO ACTION ON DELETE CASCADE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB;

-- New table
CREATE TABLE `battlemanager_users` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`email_normalized` VARCHAR(50) NOT NULL COLLATE 'latin1_swedish_ci',
	`name` VARCHAR(50) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`password` VARCHAR(255) NOT NULL COLLATE 'latin1_swedish_ci',
	`is_logged_in` BIT(1) NULL DEFAULT NULL,
	`locked` BIT(1) NULL DEFAULT NULL,
	`created_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `email_unique` (`email_normalized`) USING BTREE
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1;

-- New column for vips discordId
ALTER TABLE `vsm_vips`
ADD COLUMN `discord_id` BIGINT(20) NULL DEFAULT NULL;

-- New columns for server url and last connection
ALTER TABLE `tbl_server`
ADD COLUMN `battlemanager_endpoint` VARCHAR(200) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
ADD COLUMN `battlemanager_lastconnection` TIMESTAMP NULL DEFAULT NULL;
