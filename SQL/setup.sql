-- USERS
CREATE TABLE IF NOT EXISTS users (
  id_user     SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  surname     VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(50)  NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_key ON users(email);

-- LOCATION (+ cover image url)
CREATE TABLE IF NOT EXISTS location (
  id_location SERIAL PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  address     VARCHAR(255) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  region      VARCHAR(100) NOT NULL,
  country     VARCHAR(100) NOT NULL,
  capacity    INT NOT NULL,
  cover_image_url TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- SPACETYPE
CREATE TABLE IF NOT EXISTS spacetype (
  id_space_type SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  description   VARCHAR(255)
);

-- SERVICE
CREATE TABLE IF NOT EXISTS service (
  id_service SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL
);

-- LOCATION ↔ SERVICE
CREATE TABLE IF NOT EXISTS locationservice (
  id_location INT NOT NULL REFERENCES location(id_location),
  id_service  INT NOT NULL REFERENCES service(id_service),
  PRIMARY KEY (id_location, id_service)
);

-- AVAILABILITY
CREATE TABLE IF NOT EXISTS availability (
  id_availability SERIAL PRIMARY KEY,
  id_location     INT NOT NULL REFERENCES location(id_location),
  id_space_type   INT NOT NULL REFERENCES spacetype(id_space_type),
  date            DATE NOT NULL,
  start_time      TIME NOT NULL,
  end_time        TIME NOT NULL,
  available_seats INT  NOT NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT now(),
  updated_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- BOOKINGSTATUS
CREATE TABLE IF NOT EXISTS bookingstatus (
  id_booking_status SERIAL PRIMARY KEY,
  name              VARCHAR(50) NOT NULL
);

-- BOOKING
CREATE TABLE IF NOT EXISTS booking (
  id_booking        SERIAL PRIMARY KEY,
  id_user           INT NOT NULL REFERENCES users(id_user),
  id_availability   INT NOT NULL REFERENCES availability(id_availability),
  id_booking_status INT NOT NULL REFERENCES bookingstatus(id_booking_status),
  booking_date      TIMESTAMP NOT NULL DEFAULT now(),
  created_at        TIMESTAMP NOT NULL DEFAULT now(),
  updated_at        TIMESTAMP NOT NULL DEFAULT now()
);

-- PAYMENT
CREATE TABLE IF NOT EXISTS payment (
  id_payment   SERIAL PRIMARY KEY,
  id_booking   INT NOT NULL REFERENCES booking(id_booking),
  amount       DECIMAL(10,2) NOT NULL,
  payment_date TIMESTAMP NOT NULL DEFAULT now(),
  method       VARCHAR(50) NOT NULL,
  status       VARCHAR(50) NOT NULL
);

-- NOTIFICATION
CREATE TABLE IF NOT EXISTS notification (
  id_notification SERIAL PRIMARY KEY,
  id_user         INT NOT NULL REFERENCES users(id_user),
  message         VARCHAR(255) NOT NULL,
  sent_at         TIMESTAMP NOT NULL DEFAULT now(),
  read_at         TIMESTAMP NULL,
  status          VARCHAR(50) NOT NULL
);

-- FAVORITES: location
CREATE TABLE IF NOT EXISTS favorite_location (
  id_user     INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
  id_location INT NOT NULL REFERENCES location(id_location) ON DELETE CASCADE,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (id_user, id_location)
);

-- FAVORITES: space
CREATE TABLE IF NOT EXISTS favorite_space (
  id_user  INT NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
  id_space INT NOT NULL REFERENCES space(id_space) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  PRIMARY KEY (id_user, id_space)
);

-- SPACE (stanza fisica, collegata a location + spacetype)
CREATE TABLE IF NOT EXISTS space (
  id_space      SERIAL PRIMARY KEY,
  id_location   INT NOT NULL REFERENCES location(id_location) ON DELETE CASCADE,
  id_space_type INT NOT NULL REFERENCES spacetype(id_space_type),
  name          VARCHAR(160) NOT NULL,
  description   TEXT,
  max_guests    INT NOT NULL DEFAULT 4,
  price_symbol  VARCHAR(4)  NOT NULL DEFAULT '€€',
  image_url     TEXT,
  created_at    TIMESTAMP NOT NULL DEFAULT now(),
  updated_at    TIMESTAMP NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_space_location ON space(id_location);
CREATE INDEX IF NOT EXISTS idx_space_type     ON space(id_space_type);

-- UNIQUE per usare ON CONFLICT (name) su SPACETYPE
CREATE UNIQUE INDEX IF NOT EXISTS spacetype_name_key ON spacetype(name);

-- (Opzionale ma consigliato) UNIQUE per usare ON CONFLICT (city) su LOCATION
CREATE UNIQUE INDEX IF NOT EXISTS location_city_key ON location(city);
