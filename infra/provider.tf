terraform {
  required_providers {
    // Use Cloudflare provider version 4.0.
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }

  backend "s3" {
    bucket = "run5-api-dev-tfstate"
    key    = "run5-api.tfstate"
    endpoints = {
      s3 = "https://6f27fd2dc5684337f1ab0d75259ce22b.r2.cloudflarestorage.com"
    }
    region                      = "us-east-1"
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_metadata_api_check     = true
    skip_s3_checksum            = true
  }
}

// Configure the Cloudflare provider with variables for email and API key.
provider "cloudflare" {
  api_token = var.api_token
}
