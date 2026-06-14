ALTER TABLE users ADD 
    auth_provider VARCHAR(20) DEFAULT 'LOCAL' NOT NULL,
    provider_id VARCHAR(255) NULL,
    is_verified BIT DEFAULT 0 NOT NULL,
    verification_code VARCHAR(10) NULL,
    verification_expiry DATETIME2 NULL;

-- Update existing users to be verified so they don't get locked out
UPDATE users SET is_verified = 1;
