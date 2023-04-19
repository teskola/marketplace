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

INSERT INTO users (id, name, email, phone, password) VALUES ('test-user-id', 'Snooker Player', 'ronnie@sheffield.com', '050123123', 'hashedPassword');
INSERT INTO products (title, image, description, price, seller) 
VALUES ('swan rest', 'https://cdn.shopify.com/s/files/1/0502/5307/0504/products/swanneckplusshaft_grande.jpg?v=1612899650', 'Good old swan rest.', 150, 'test-user-id');
INSERT INTO products (title, image, description, price, seller) 
VALUES ('extended spider rest', 'https://thumbs.dreamstime.com/z/snooker-extended-spider-green-pad-61868007.jpg', 'Good old extended spider rest.', 120, 'test-user-id');
INSERT INTO products (title, image, description, price, seller) 
VALUES ('rest', 'https://img.fruugo.com/product/1/49/198799491_max.jpg', 'Basic rest.', 50, 'test-user-id');