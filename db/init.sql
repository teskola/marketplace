CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(60) NOT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

CREATE TABLE IF NOT EXISTS `products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(60) NOT NULL,
  `image` VARCHAR(200) NULL DEFAULT NULL,
  `description` VARCHAR(255) NULL DEFAULT NULL,
  `price` INT(11) NULL DEFAULT NULL,
  `created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `seller` VARCHAR(36) NOT NULL,
  PRIMARY KEY (`id`, `seller`),
  INDEX `fk_products_users_idx` (`seller` ASC),
  CONSTRAINT `fk_products_users`
    FOREIGN KEY (`seller`)
    REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = latin1;

INSERT INTO users (id, name, email, phone, password) VALUES ('test-user-id', 'Test User', 'test@test.com', '050123123', 'hashedPassword');
INSERT INTO products (title, image, description, price, seller) 
VALUES ('house', 'https://s42814.pcdn.co/wp-content/uploads/2020/09/iStock_185930591-scaled.jpg.optimal.jpg', 'Nice house.', 425000, 'test-user-id');

SET GLOBAL time_zone = 'Europe/Helsinki';
