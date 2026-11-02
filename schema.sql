CREATE TABLE IF NOT EXISTS leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  designation VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  facility_type VARCHAR(100) NOT NULL,
  engagement_model VARCHAR(100) NOT NULL,
  area_requirement VARCHAR(100) NOT NULL,
  message TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  utm_name VARCHAR(255),
  app_tag VARCHAR(50),
  custom_metadata LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS conversion_event_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id VARCHAR(255) NOT NULL,
  event_name VARCHAR(100) NOT NULL,
  pixel_id VARCHAR(100) NOT NULL,
  event_time_ms BIGINT NOT NULL,
  has_oppref BOOLEAN NOT NULL,
  delivery VARCHAR(20) NOT NULL,
  http_status INT,
  detail TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
